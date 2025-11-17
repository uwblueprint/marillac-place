import { TaskType, DayPreference, TimePreference } from "@prisma/client";
import { addDays, endOfDay, set, startOfDay, startOfWeek } from "date-fns";
import db from "../../prisma";
import { orderedDays } from "../../constants/days";

// assigns all required tasks to each participant for the current week
async function assignRequiredTasks() {
  try {
    const participants = await db.participant.findMany({
      where: {
        OR: [{ departure: null }, { departure: { gt: endOfDay(new Date()) } }],
      },
      select: { pid: true },
    });

    const requiredTasks = await db.task.findMany({
      where: { type: TaskType.REQUIRED },
    });

    await Promise.all(
      participants.map(async (participant) => {
        await Promise.all(
          requiredTasks.map(async (requiredTask) => {
            if (
              requiredTask.day_preference ===
                DayPreference.PARTICIPANT_PREFERENCE ||
              requiredTask.time_preference ===
                TimePreference.PARTICIPANT_PREFERENCE
            ) {
              throw new Error("required task must be strictly defined");
            }

            if (requiredTask.day_preference === DayPreference.DAILY) {
              await Promise.all(
                orderedDays.map(async (day) => {
                  const baseDate = addDays(
                    startOfWeek(new Date()),
                    orderedDays.indexOf(day)
                  );
                  if (
                    requiredTask.time_preference === TimePreference.SPECIFIC
                  ) {
                    if (
                      requiredTask.start_time === null ||
                      requiredTask.end_time == null
                    ) {
                      throw new Error(
                        "required task is missing time information"
                      );
                    }

                    const startDate = set(baseDate, {
                      hours: requiredTask.start_time.getHours(),
                      minutes: requiredTask.start_time.getMinutes(),
                      seconds: requiredTask.start_time.getSeconds(),
                      milliseconds: requiredTask.start_time.getMilliseconds(),
                    });

                    const endDate = set(baseDate, {
                      hours: requiredTask.end_time.getHours(),
                      minutes: requiredTask.end_time.getMinutes(),
                      seconds: requiredTask.end_time.getSeconds(),
                      milliseconds: requiredTask.end_time.getMilliseconds(),
                    });

                    await db.assignedTask.create({
                      data: {
                        pid: participant.pid,
                        name: requiredTask.name,
                        type: requiredTask.type,
                        value: requiredTask.value,
                        penalty: requiredTask.penalty,
                        comment: requiredTask.comment,
                        start_date: startDate,
                        end_date: endDate,
                      },
                    });
                  } else if (
                    requiredTask.time_preference === TimePreference.ANYTIME
                  ) {
                    const startDate = startOfDay(baseDate);
                    const endDate = addDays(startDate, 1);

                    await db.assignedTask.create({
                      data: {
                        pid: participant.pid,
                        name: requiredTask.name,
                        type: requiredTask.type,
                        value: requiredTask.value,
                        penalty: requiredTask.penalty,
                        comment: requiredTask.comment,
                        start_date: startDate,
                        end_date: endDate,
                      },
                    });
                  }
                })
              );
            } else if (
              requiredTask.day_preference === DayPreference.EVERY_SELECTED_DAYS
            ) {
              await Promise.all(
                requiredTask.days.map(async (day) => {
                  const baseDate = addDays(
                    startOfWeek(new Date()),
                    orderedDays.indexOf(day)
                  );
                  if (
                    requiredTask.time_preference === TimePreference.SPECIFIC
                  ) {
                    if (
                      requiredTask.start_time === null ||
                      requiredTask.end_time == null
                    ) {
                      throw new Error(
                        "required task is missing time information"
                      );
                    }

                    const startDate = set(baseDate, {
                      hours: requiredTask.start_time.getHours(),
                      minutes: requiredTask.start_time.getMinutes(),
                      seconds: requiredTask.start_time.getSeconds(),
                      milliseconds: requiredTask.start_time.getMilliseconds(),
                    });

                    const endDate = set(baseDate, {
                      hours: requiredTask.end_time.getHours(),
                      minutes: requiredTask.end_time.getMinutes(),
                      seconds: requiredTask.end_time.getSeconds(),
                      milliseconds: requiredTask.end_time.getMilliseconds(),
                    });

                    await db.assignedTask.create({
                      data: {
                        pid: participant.pid,
                        name: requiredTask.name,
                        type: requiredTask.type,
                        value: requiredTask.value,
                        penalty: requiredTask.penalty,
                        comment: requiredTask.comment,
                        start_date: startDate,
                        end_date: endDate,
                      },
                    });
                  } else if (
                    requiredTask.time_preference === TimePreference.ANYTIME
                  ) {
                    const startDate = startOfDay(baseDate);
                    const endDate = addDays(startDate, 1);

                    await db.assignedTask.create({
                      data: {
                        pid: participant.pid,
                        name: requiredTask.name,
                        type: requiredTask.type,
                        value: requiredTask.value,
                        penalty: requiredTask.penalty,
                        comment: requiredTask.comment,
                        start_date: startDate,
                        end_date: endDate,
                      },
                    });
                  }
                })
              );
            } else if (
              requiredTask.day_preference === DayPreference.DAY_RANGE
            ) {
              if (requiredTask.days.length !== 2)
                throw new Error("day range must contain exactly two elements");
              const startDate = addDays(
                startOfWeek(new Date()),
                orderedDays.indexOf(requiredTask.days[0])
              );
              const endDate = addDays(
                startOfWeek(new Date()),
                orderedDays.indexOf(requiredTask.days[1]) + 1
              );

              await db.assignedTask.create({
                data: {
                  pid: participant.pid,
                  name: requiredTask.name,
                  type: requiredTask.type,
                  value: requiredTask.value,
                  penalty: requiredTask.penalty,
                  comment: requiredTask.comment,
                  start_date: startDate,
                  end_date: endDate,
                },
              });
            }
          })
        );
      })
    );
    console.log("successfully assigned required tasks to participants");
  } catch (err) {
    console.error(err);
  }
}

export default assignRequiredTasks;
