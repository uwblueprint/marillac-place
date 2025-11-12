import { TaskType, DayPreference, TimePreference } from "@prisma/client";
import db from "../../prisma";
import { getBeginningOfWeek, getToday } from "../../utils/dateUtils";
import { orderedDays } from "../../constants/days";

// assigns all required tasks to each participant for the current week
async function assignRequiredTasks() {
  try {
    const today = getToday();
    const beginningOfWeek = getBeginningOfWeek();

    const participants = await db.participant.findMany({
      where: {
        OR: [{ departure: null }, { departure: { gt: today } }],
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
                  const base = new Date(beginningOfWeek);
                  base.setDate(
                    beginningOfWeek.getDate() + orderedDays.indexOf(day)
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

                    const startDate = new Date(base);
                    startDate.setHours(
                      requiredTask.start_time.getHours(),
                      requiredTask.start_time.getMinutes(),
                      requiredTask.start_time.getSeconds(),
                      requiredTask.start_time.getMilliseconds()
                    );

                    const endDate = new Date(base);
                    endDate.setHours(
                      requiredTask.end_time.getHours(),
                      requiredTask.end_time.getMinutes(),
                      requiredTask.end_time.getSeconds(),
                      requiredTask.end_time.getMilliseconds()
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
                  } else if (
                    requiredTask.time_preference === TimePreference.ANYTIME
                  ) {
                    const startDate = new Date(base);
                    const endDate = new Date(base);
                    endDate.setDate(endDate.getDate() + 1);

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
                  const base = new Date(beginningOfWeek);
                  base.setDate(
                    beginningOfWeek.getDate() + orderedDays.indexOf(day)
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

                    const startDate = new Date(base);
                    startDate.setHours(
                      requiredTask.start_time.getHours(),
                      requiredTask.start_time.getMinutes(),
                      requiredTask.start_time.getSeconds(),
                      requiredTask.start_time.getMilliseconds()
                    );

                    const endDate = new Date(base);
                    endDate.setHours(
                      requiredTask.end_time.getHours(),
                      requiredTask.end_time.getMinutes(),
                      requiredTask.end_time.getSeconds(),
                      requiredTask.end_time.getMilliseconds()
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
                  } else if (
                    requiredTask.time_preference === TimePreference.ANYTIME
                  ) {
                    const startDate = new Date(base);
                    const endDate = new Date(base);
                    endDate.setDate(endDate.getDate() + 1);

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
              const startDate = new Date(beginningOfWeek);
              startDate.setDate(
                beginningOfWeek.getDate() +
                  orderedDays.indexOf(requiredTask.days[0])
              );

              const endDate = new Date(beginningOfWeek);
              endDate.setDate(
                beginningOfWeek.getDate() +
                  orderedDays.indexOf(requiredTask.days[1]) +
                  1
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
