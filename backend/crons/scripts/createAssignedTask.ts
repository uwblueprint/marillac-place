import prisma from "../../prisma";
import { TaskType, RecurrenceFrequency, TimeOption, DayOfWeek } from "@prisma/client";
import ParticipantService from "../../services/implementation/participantImplementation"; 
import TaskService from "../../services/implementation/taskImplementation";
import { formatDateTime } from "../../utils/formatDateTime";

async function createAssignedTasks(): Promise<boolean> {
  try {
    const participantService = new ParticipantService();
    const taskService = new TaskService();

    const participants = await participantService.getCurrentParticipants();
    const requiredTasks = await taskService.getTasksByType(TaskType.REQUIRED);

    const weekdayOffsets: { [key in DayOfWeek]: number } = {
      MONDAY: 0,
      TUESDAY: 1,
      WEDNESDAY: 2,
      THURSDAY: 3,
      FRIDAY: 4,
      SATURDAY: 5,
      SUNDAY: 6,
    };

    const now = new Date();
    const currentDay = now.getDay(); 
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; 
    const mondayOfCurrentWeek = new Date(now);
    mondayOfCurrentWeek.setDate(now.getDate() + mondayOffset);
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);

    for (const participant of participants) {
      for (const task of requiredTasks) {
        if (task.recurrence_preference === RecurrenceFrequency.EVERY_SELECTED_DAYS || 
            task.recurrence_preference === RecurrenceFrequency.DAILY) {
          for (const repeatDay of task.repeat_days) {
            const offset = weekdayOffsets[repeatDay];
            const taskDate = new Date(mondayOfCurrentWeek);
            taskDate.setDate(mondayOfCurrentWeek.getDate() + offset);
            let startDate: Date;
            let endDate: Date;
            if (task.time_preference === TimeOption.SPECIFIC) {
              startDate = new Date(taskDate);
              endDate = new Date(taskDate);
              if (task.start_time) {
                const [hours, minutes] = task.start_time.split(":").map(Number);
                startDate.setHours(hours, minutes, 0, 0);
              }
              if (task.end_time) {
                const [hours, minutes] = task.end_time.split(":").map(Number);
                endDate.setHours(hours, minutes, 0, 0);
              }
            } else {
              startDate = new Date(taskDate);
              startDate.setHours(0, 0, 0, 0);
              endDate = new Date(taskDate);
              endDate.setHours(23, 59, 0, 0);
            }
            const startDateString = formatDateTime(startDate, true);
            const endDateString = formatDateTime(endDate, true);
            await prisma.assignedTask.create({
              data: {
                participant_id: participant.participant_id,
                task_name: task.task_name,
                task_type: task.task_type,
                start_date: startDateString,
                end_date: endDateString,
                marillac_bucks_addition: task.marillac_bucks_addition,
                marillac_bucks_deduction: task.marillac_bucks_deduction,
                comment: task.comment,
              },
            });
          }
        } else if (task.recurrence_preference === RecurrenceFrequency.ANY_SELECTED_DAYS) {

          const firstDayOffset = weekdayOffsets[task.repeat_days[0]];
          const lastDayOffset = weekdayOffsets[task.repeat_days[task.repeat_days.length - 1]];
  
          const startDate = new Date(mondayOfCurrentWeek);
          startDate.setDate(mondayOfCurrentWeek.getDate() + firstDayOffset);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(mondayOfCurrentWeek);
          endDate.setDate(mondayOfCurrentWeek.getDate() + lastDayOffset);
          endDate.setHours(23, 59, 0, 0);
          
          const startDateString = formatDateTime(startDate, true);
          const endDateString = formatDateTime(endDate, true);
          
          await prisma.assignedTask.create({
            data: {
              participant_id: participant.participant_id,
              task_name: task.task_name,
              task_type: task.task_type,
              start_date: startDateString,
              end_date: endDateString,
              marillac_bucks_addition: task.marillac_bucks_addition,
              marillac_bucks_deduction: task.marillac_bucks_deduction,
              comment: task.comment,
            },
          });
        }
      }
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default createAssignedTasks;
