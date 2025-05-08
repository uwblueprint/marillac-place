import cron from "node-cron";
import expireAdminNotes from "./scripts/expireAdminNotes";

cron.schedule("0 0 * * * *", async () => {
  const res = await expireAdminNotes();
  if (res) {
    console.log("Deleted expired notes");
  } else {
    console.log("Could not expire admin notes");
  }
});
