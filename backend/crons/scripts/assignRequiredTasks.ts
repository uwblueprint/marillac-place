import { Task, TaskType } from "@prisma/client";
import db from "../../prisma";
import { assignTasksToAllParticipants } from "../../utils/taskUtils";

// assigns all required tasks to each participant for the current week
async function assignRequiredTasks() {
  try {
    const requiredTasks: Task[] = await db.task.findMany({
      where: { type: TaskType.REQUIRED },
    });
    assignTasksToAllParticipants(requiredTasks);
    console.log("successfully assigned required tasks to participants");
  } catch (err) {
    console.error(err);
  }
}

export default assignRequiredTasks;
