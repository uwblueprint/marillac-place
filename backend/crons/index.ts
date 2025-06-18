import cron from "node-cron";
import expireAdminNotes from "./scripts/expireAdminNotes";
import expireAdminAnnouncements from "./scripts/expireAdminAnnouncements";
import expireLoginStreak from "./scripts/expireLoginStreak";

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
