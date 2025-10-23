import cron from "node-cron";
import expireAdminNotes from "./scripts/expireAdminNotes";
import expireAdminAnnouncements from "./scripts/expireAdminAnnouncements";
import {
  generateWeeklyReportCSV,
  generateMonthlyReportCSV,
} from "./scripts/generateDataReportCSV";

cron.schedule("0 0 * * * *", async () => {
  const res = await expireAdminNotes();
  if (res) {
    console.log("Deleted expired notes");
  } else {
    console.log("Could not expire admin notes");
  }
});

cron.schedule("0 0 0 * * *", async () => {
  const res = await expireAdminAnnouncements();
  if (res) {
    console.log("Expired admin announcements");
  } else {
    console.log("Could not expire admin announcements");
  }
});

// Weekly data report, runs every Monday at 9:00 AM
cron.schedule("0 9 * * 1", async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting weekly data report generation...`);

  const res = await generateWeeklyReportCSV();
  if (res) {
    console.log(`[${timestamp}] Weekly data report generated successfully`);
  } else {
    console.log(`[${timestamp}] Could not generate weekly data report`);
  }
});

// Monthly data report, runs on the 1st of every month at 9:00 AM
cron.schedule("0 9 1 * *", async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting monthly data report generation...`);

  const res = await generateMonthlyReportCSV();
  if (res) {
    console.log(`[${timestamp}] Monthly data report generated successfully`);
  } else {
    console.log(`[${timestamp}] Could not generate monthly data report`);
  }
});
