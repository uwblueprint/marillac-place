import cron from "node-cron";
import { isSameDay } from "date-fns";
import expireNotes from "./scripts/expireNotes";
import expireAnnouncements from "./scripts/expireAnnouncements";
import resetLoginStreak from "./scripts/resetLoginStreak";
import assignRequiredTasks from "./scripts/assignRequiredTasks";
import sendMonthlyReport from "./scripts/sendMonthlyReport";
import sendWeeklyReport from "./scripts/sendWeeklyReport";
import { getEndOfMonth } from "../utils/dateUtils";

const torontoTz = { timezone: "America/Toronto" };

cron.schedule(
  "0 0 * * * *",
  async () => {
    await expireNotes();
  },
  torontoTz
);

cron.schedule(
  "0 0 0 * * *",
  async () => {
    await expireAnnouncements();
  },
  torontoTz
);

cron.schedule(
  "0 59 23 * * *",
  async () => {
    await resetLoginStreak();
  },
  torontoTz
);

cron.schedule(
  "0 0 0 * * 0",
  async () => {
    await assignRequiredTasks();
  },
  torontoTz
);

cron.schedule(
  "0 0 23 * * 6",
  async () => {
    await sendWeeklyReport();
  },
  torontoTz
);

cron.schedule(
  "0 0 23 * * *",
  async () => {
    if (isSameDay(getEndOfMonth(new Date()), new Date())) {
      await sendMonthlyReport();
    }
  },
  torontoTz
);
