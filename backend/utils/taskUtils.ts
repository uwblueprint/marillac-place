import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  startOfWeek,
  startOfDay,
} from "date-fns";
import {
  Task,
  DayPreference,
  TimePreference,
  DayOfWeek,
  TaskStatus,
  TaskType,
} from "@prisma/client";
import db from "../prisma";
import { orderedDays } from "../constants/days";
import {
  getEndOfDay,
  getESTDate,
  getUTCDate,
  combineDayAndTime,
  getStartOfWeek,
  getEndOfWeek,
} from "./dateUtils";

type StartAndEndDates = {
  startDate: Date;
  endDate: Date;
};

function buildStartAndEndDates(
  task: Task,
  weekDate: Date = new Date()
): StartAndEndDates[] {
  const { day_preference, time_preference, days, start_time, end_time } = task;

  if (
    day_preference === DayPreference.PARTICIPANT_PREFERENCE ||
    time_preference === TimePreference.PARTICIPANT_PREFERENCE
  ) {
    throw new Error(
      "day and time preferences must be strictly defined to determine start and end dates"
    );
  }

  const estDate = getESTDate(weekDate);
  const startOfWeekEST = startOfWeek(estDate);

  let startTimeEST: Date;
  let endTimeEST: Date;
  if (time_preference === TimePreference.SPECIFIC) {
    if (start_time === null || end_time === null) {
      throw new Error(
        "time preference is specific but start and end times are not provided"
      );
    }
    startTimeEST = getESTDate(start_time);
    endTimeEST = getESTDate(end_time);
  } else {
    startTimeEST = startOfDay(estDate);
    endTimeEST = endOfDay(estDate);
  }

  const startAndEndDates: StartAndEndDates[] = [];
  if (day_preference === DayPreference.DAILY) {
    orderedDays.forEach((day: DayOfWeek) => {
      const baseDate = addDays(startOfWeekEST, orderedDays.indexOf(day));
      const startDate = getUTCDate(combineDayAndTime(baseDate, startTimeEST));
      const endDate = getUTCDate(combineDayAndTime(baseDate, endTimeEST));
      startAndEndDates.push({ startDate, endDate });
    });
  } else if (day_preference === DayPreference.EVERY_SELECTED_DAYS) {
    task.days.forEach((day: DayOfWeek) => {
      const baseDate = addDays(startOfWeekEST, orderedDays.indexOf(day));
      const startDate = getUTCDate(combineDayAndTime(baseDate, startTimeEST));
      const endDate = getUTCDate(combineDayAndTime(baseDate, endTimeEST));
      startAndEndDates.push({ startDate, endDate });
    });
  } else if (day_preference === DayPreference.DAY_RANGE) {
    if (days.length <= 1) {
      throw new Error("Day range should contain at least two days");
    }
    const baseStartDate = addDays(startOfWeekEST, orderedDays.indexOf(days[0]));
    const baseEndDate = addDays(
      startOfWeekEST,
      orderedDays.indexOf(days[days.length - 1])
    );
    const startDate = getUTCDate(
      combineDayAndTime(baseStartDate, startTimeEST)
    );
    const endDate = getUTCDate(combineDayAndTime(baseEndDate, endTimeEST));
    startAndEndDates.push({ startDate, endDate });
  }
  return startAndEndDates;
}

export async function assignTasksToParticipants(
  tasks: Task[],
  pids?: number[],
  weekDate: Date = new Date()
) {
  let participants: { pid: number; departure: Date | null }[];
  if (pids) {
    participants = await db.participant.findMany({
      where: { pid: { in: pids } },
      select: { pid: true, departure: true },
    });
  } else {
    participants = await db.participant.findMany({
      where: {
        OR: [{ departure: null }, { departure: { gt: getEndOfDay(weekDate) } }],
      },
      select: { pid: true, departure: true },
    });
  }

  await Promise.all(
    participants.map(async (participant) => {
      await Promise.all(
        tasks.map(async (task) => {
          const startAndEndDates = buildStartAndEndDates(task, weekDate);
          await Promise.all(
            startAndEndDates.map(async ({ startDate, endDate }) => {
              if (participant.departure && startDate >= participant.departure) {
                return;
              }
              await db.assignedTask.create({
                data: {
                  pid: participant.pid,
                  tid: task.tid,
                  name: task.name,
                  type: task.type,
                  value: task.value,
                  penalty: task.penalty,
                  comment: task.comment,
                  start_date: startDate,
                  end_date: endDate,
                },
              });
            })
          );
        })
      );
    })
  );
}

export async function carryOverTasks(
  targetDate: Date = new Date()
): Promise<void> {
  const targetWeekStart = getStartOfWeek(targetDate);
  const targetWeekEnd = getEndOfWeek(targetWeekStart);

  const participants = await db.participant.findMany({
    where: {
      OR: [{ departure: null }, { departure: { gt: getEndOfDay(targetDate) } }],
    },
    select: {
      pid: true,
      departure: true,
    },
  });

  const requiredTasks = await db.task.findMany({
    where: { type: TaskType.REQUIRED },
  });

  await Promise.all(
    participants.map(async (participant) => {
      const existingCount = await db.assignedTask.count({
        where: {
          pid: participant.pid,
          start_date: { lte: targetWeekEnd },
          end_date: { gte: targetWeekStart },
        },
      });

      if (existingCount > 0) {
        return;
      }

      const lastTask = await db.assignedTask.findFirst({
        where: {
          pid: participant.pid,
          start_date: { lt: targetWeekStart },
        },
        orderBy: { start_date: "desc" },
      });

      if (!lastTask) {
        await assignTasksToParticipants(
          requiredTasks,
          [participant.pid],
          targetWeekStart
        );
        return;
      }

      const sourceWeekStart = getStartOfWeek(lastTask.start_date);
      const sourceWeekEnd = getEndOfWeek(sourceWeekStart);

      const sourceTasks = await db.assignedTask.findMany({
        where: {
          pid: participant.pid,
          start_date: { lte: sourceWeekEnd },
          end_date: { gte: sourceWeekStart },
        },
        orderBy: { start_date: "asc" },
      });

      if (sourceTasks.length === 0) {
        await assignTasksToParticipants(
          requiredTasks,
          [participant.pid],
          targetWeekStart
        );
        return;
      }

      const sourceEST = getESTDate(sourceWeekStart);
      const targetEST = getESTDate(targetWeekStart);
      const dayDiff = differenceInCalendarDays(targetEST, sourceEST);

      await Promise.all(
        sourceTasks.map(async (task) => {
          const taskStartEST = getESTDate(task.start_date);
          const taskEndEST = getESTDate(task.end_date);
          const newStartEST = addDays(taskStartEST, dayDiff);
          const newEndEST = addDays(taskEndEST, dayDiff);
          const newStartDate = getUTCDate(newStartEST);
          const newEndDate = getUTCDate(newEndEST);

          if (participant.departure && newStartDate >= participant.departure) {
            return;
          }

          await db.assignedTask.create({
            data: {
              pid: participant.pid,
              tid: task.tid,
              name: task.name,
              type: task.type,
              value: task.value,
              penalty: task.penalty,
              comment: task.comment,
              status: TaskStatus.ASSIGNED,
              start_date: newStartDate,
              end_date: newEndDate,
            },
          });
        })
      );
    })
  );
}

const processedWeeks = new Set<string>();
const inFlightPromises = new Map<string, Promise<void>>();

export async function ensureWeeklyTasksCarriedOver(
  targetDate: Date = new Date()
): Promise<void> {
  const targetWeekStart = getStartOfWeek(targetDate).toISOString();
  if (processedWeeks.has(targetWeekStart)) {
    return;
  }
  let promise = inFlightPromises.get(targetWeekStart);
  if (!promise) {
    promise = (async () => {
      try {
        await carryOverTasks(targetDate);
        processedWeeks.add(targetWeekStart);
      } finally {
        inFlightPromises.delete(targetWeekStart);
      }
    })();
    inFlightPromises.set(targetWeekStart, promise);
  }
  await promise;
}
