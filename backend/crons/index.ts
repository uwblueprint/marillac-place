import cron from "node-cron";
import { isLastDayOfMonth } from "date-fns";
import expireNotes from "./scripts/expireNotes";
import expireAnnouncements from "./scripts/expireAnnouncements";
import resetLoginStreak from "./scripts/resetLoginStreak";
import assignRequiredTasks from "./scripts/assignRequiredTasks";
import sendMonthlyReport from "./scripts/sendMonthlyReport";
import sendWeeklyReport from "./scripts/sendWeeklyReport";
import { current } from "../utils/dateUtils";

cron.schedule("0 0 * * * *", async () => {
  await expireNotes();
});

cron.schedule("0 0 0 * * *", async () => {
  await expireAnnouncements();
});

cron.schedule("0 59 23 * * *", async () => {
  await resetLoginStreak();
});

cron.schedule("0 0 0 * * 0", async () => {
  await assignRequiredTasks();
});

cron.schedule("0 0 23 * * 6", async () => {
  await sendWeeklyReport();
});

cron.schedule("0 0 23 * * *", async () => {
  if (isLastDayOfMonth(current())) {
    await sendMonthlyReport();
  }
});
