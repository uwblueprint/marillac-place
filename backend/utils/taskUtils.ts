import { addDays, endOfDay, startOfWeek, set, startOfDay } from "date-fns";
import { Task, DayPreference, TimePreference } from "@prisma/client";
import db from "../prisma";
import { orderedDays } from "../constants/days";
import { current } from "./dateUtils";

export async function assignTasksToAllParticipants(tasks: Task[]) {
  const participants = await db.participant.findMany({
    where: {
      OR: [{ departure: null }, { departure: { gt: endOfDay(current()).toISOString() } }],
    },
    select: { pid: true },
  });

  await Promise.all(
    participants.map(async (participant) => {
      await Promise.all(
        tasks.map(async (task) => {
          if (
            task.day_preference === DayPreference.PARTICIPANT_PREFERENCE ||
            task.time_preference === TimePreference.PARTICIPANT_PREFERENCE
          ) {
            throw new Error("required task must be strictly defined");
          }

          if (task.day_preference === DayPreference.DAILY) {
            await Promise.all(
              orderedDays.map(async (day) => {
                const baseDate = addDays(
                  startOfWeek(current()),
                  orderedDays.indexOf(day)
                );
                if (task.time_preference === TimePreference.SPECIFIC) {
                  if (task.start_time === null || task.end_time == null) {
                    throw new Error(
                      "required task is missing time information"
                    );
                  }

                  const startDate = set(baseDate, {
                    hours: task.start_time.getHours(),
                    minutes: task.start_time.getMinutes(),
                    seconds: task.start_time.getSeconds(),
                    milliseconds: task.start_time.getMilliseconds(),
                  }).toISOString();

                  const endDate = set(baseDate, {
                    hours: task.end_time.getHours(),
                    minutes: task.end_time.getMinutes(),
                    seconds: task.end_time.getSeconds(),
                    milliseconds: task.end_time.getMilliseconds(),
                  }).toISOString();

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
                } else if (task.time_preference === TimePreference.ANYTIME) {
                  const startDate = startOfDay(baseDate).toISOString();
                  const endDate = addDays(startDate, 1).toISOString();

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
                }
              })
            );
          } else if (
            task.day_preference === DayPreference.EVERY_SELECTED_DAYS
          ) {
            await Promise.all(
              task.days.map(async (day) => {
                const baseDate = addDays(
                  startOfWeek(current()),
                  orderedDays.indexOf(day)
                );
                if (task.time_preference === TimePreference.SPECIFIC) {
                  if (task.start_time === null || task.end_time == null) {
                    throw new Error(
                      "required task is missing time information"
                    );
                  }

                  const startDate = set(baseDate, {
                    hours: task.start_time.getHours(),
                    minutes: task.start_time.getMinutes(),
                    seconds: task.start_time.getSeconds(),
                    milliseconds: task.start_time.getMilliseconds(),
                  }).toISOString();

                  const endDate = set(baseDate, {
                    hours: task.end_time.getHours(),
                    minutes: task.end_time.getMinutes(),
                    seconds: task.end_time.getSeconds(),
                    milliseconds: task.end_time.getMilliseconds(),
                  }).toISOString();

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
                } else if (task.time_preference === TimePreference.ANYTIME) {
                  const startDate = startOfDay(baseDate).toISOString();
                  const endDate = addDays(startDate, 1).toISOString();

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
                }
              })
            );
          } else if (task.day_preference === DayPreference.DAY_RANGE) {
            if (task.days.length !== 2)
              throw new Error("day range must contain exactly two elements");

            console.info(current());
            console.info(startOfWeek(current()));

            const startDate = addDays(
              startOfWeek(current()),
              orderedDays.indexOf(task.days[0])
            ).toISOString();
            const endDate = addDays(
              startOfWeek(current()),
              orderedDays.indexOf(task.days[1]) + 1
            ).toISOString();

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
          }
        })
      );
    })
  );
}
