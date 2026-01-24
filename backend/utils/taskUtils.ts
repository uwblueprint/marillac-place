import { addDays, endOfDay, startOfWeek, startOfDay } from "date-fns";
import { Task, DayPreference, TimePreference, DayOfWeek } from "@prisma/client";
import db from "../prisma";
import { orderedDays } from "../constants/days";
import {
  getEndOfDay,
  getESTDate,
  getUTCDate,
  combineDayAndTime,
} from "./dateUtils";

type StartAndEndDates = {
  startDate: Date;
  endDate: Date;
};

function buildStartAndEndDates(task: Task): StartAndEndDates[] {
  const { day_preference, time_preference, days, start_time, end_time } = task;

  if (
    day_preference === DayPreference.PARTICIPANT_PREFERENCE ||
    time_preference === TimePreference.PARTICIPANT_PREFERENCE
  ) {
    throw new Error(
      "day and time preferences must be strictly defined to determine start and end dates"
    );
  }

  const estDate = getESTDate(new Date());
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
  pids?: number[]
) {
  let participantPids: number[];
  if (pids) {
    participantPids = pids;
  } else {
    const participants = await db.participant.findMany({
      where: {
        OR: [
          { departure: null },
          { departure: { gt: getEndOfDay(new Date()) } },
        ],
      },
      select: { pid: true },
    });
    participantPids = participants.map((p) => p.pid);
  }

  await Promise.all(
    participantPids.map(async (pid) => {
      await Promise.all(
        tasks.map(async (task) => {
          const startAndEndDates = buildStartAndEndDates(task);
          await Promise.all(
            startAndEndDates.map(async ({ startDate, endDate }) => {
              await db.assignedTask.create({
                data: {
                  pid,
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
