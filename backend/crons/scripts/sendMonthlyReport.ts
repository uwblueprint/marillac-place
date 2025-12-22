import db from "../../prisma";
import { sendReportEmail } from "../../utils/mailUtils";
import {
  formatDataReport,
  generateDataReport,
  ReportType,
} from "../../utils/reportUtils";

// collects data from the past month, generates a csv report and sends the report to marillac admin via email
async function sendMonthlyReport() {
  try {
    const report = await generateDataReport(ReportType.MONTHLY);
    if (report === null) throw new Error("unable to generate monthly report");

    const csvContent = formatDataReport(report);

    const recipients = await db.reportRecipient.findMany({
      where: { monthly: true },
    });

    await Promise.all(
      recipients.map(async (recipient) => {
        await sendReportEmail(recipient.email, csvContent, ReportType.MONTHLY);
      })
    );

    // if necessary, we can clear relevant data that is already recorded in the generated report
    console.log("successfully sent monthly report to recipients");
  } catch (err) {
    console.error(err);
  }
}
export default sendMonthlyReport;
