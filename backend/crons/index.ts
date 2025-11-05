import cron from "node-cron";
import expireAdminNotes from "./scripts/expireAdminNotes";
import expireAdminAnnouncements from "./scripts/expireAdminAnnouncements";
import expireLoginStreak from "./scripts/expireLoginStreak";
import createAssignedTasks from "./scripts/createAssignedTask";
import {
  sendWeeklyReports,
  sendMonthlyReports,
} from "./scripts/sendReportEmails";

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

cron.schedule("0 0 0 * * *", async () => {
  const res = await expireLoginStreak();
  if (res) {
    console.log("Expired login streaks");
  } else {
    console.log("Could not expire login streaks");
  }
});

cron.schedule("0 0 * * 1", async () => {
  const res = await createAssignedTasks();
  if (res) {
    console.log("Created assigned tasks");
  } else {
    console.log("Could not create assigned tasks");
  }
});

// Weekly reports - every Monday at 9 AM
cron.schedule("0 9 * * 1", async () => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Starting weekly report generation and emailing...`
  );

  const res = await sendWeeklyReports();
  if (res) {
    console.log(`[${timestamp}] Weekly reports sent successfully`);
  } else {
    console.log(`[${timestamp}] Could not send weekly reports`);
  }
});

// Monthly reports - first day of month at 9 AM
cron.schedule("0 9 1 * *", async () => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Starting monthly report generation and emailing...`
  );

  const res = await sendMonthlyReports();
  if (res) {
    console.log(`[${timestamp}] Monthly reports sent successfully`);
  } else {
    console.log(`[${timestamp}] Could not send monthly reports`);
  }
});
