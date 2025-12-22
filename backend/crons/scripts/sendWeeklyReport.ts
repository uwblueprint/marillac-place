import db from "../../prisma";
import { sendReportEmail } from "../../utils/mailUtils";
import {
  formatDataReport,
  generateDataReport,
  ReportType,
} from "../../utils/reportUtils";

// collects data from the past week, generates a csv report and sends the report to marillac admin via email
async function sendWeeklyReport() {
  try {
    const report = await generateDataReport(ReportType.WEEKLY);
    if (report === null) throw new Error("unable to generate weekly report");

    const csvContent = formatDataReport(report);

    const recipients = await db.reportRecipient.findMany({
      where: { weekly: true },
    });

    await Promise.all(
      recipients.map(async (recipient) => {
        await sendReportEmail(recipient.email, csvContent, ReportType.WEEKLY);
      })
    );

    console.log("successfully sent weekly report to recipients");
  } catch (err) {
    console.error(err);
  }
}
export default sendWeeklyReport;
