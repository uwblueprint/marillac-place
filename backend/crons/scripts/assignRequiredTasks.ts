import { carryOverTasks } from "../../utils/taskUtils";

// carries over assigned tasks from the previous week to the current week for each participant
async function assignRequiredTasks() {
  try {
    await carryOverTasks();
    console.log("successfully carried over tasks for participants");
  } catch (err) {
    console.error(err);
  }
}

export default assignRequiredTasks;
