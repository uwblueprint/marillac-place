import nodemailer from "nodemailer";
import prisma from "../../prisma";
import {
  generateWeeklyReportCSV,
  generateMonthlyReportCSV,
} from "./generateDataReportCSV";
import { formatDateTime } from "../../utils/formatDateTime";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
/* eslint-disable */
async function sendReportEmail(
  to: string,
  subject: string,
  csvContent: string,
  reportPeriod: string,
  periodType: "weekly" | "monthly" = "weekly"
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${periodType}-report-${timestamp}.csv`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: `Please find the ${reportPeriod} attached as a CSV file.\n\nThis report contains comprehensive data for the reporting period.\n\nBest regards,\nMarillac Place System`,
      html: `
        <html>
          <body>
            <h2>${reportPeriod} - Marillac Place</h2>
            <p>Please find the ${reportPeriod} attached as a CSV file.</p>
            <p>This report contains comprehensive data including:</p>
            <ul>
              <li>Praise With A Raise Tasks</li>
              <li>Participant Information</li>
              <li>Financial Transactions</li>
              <li>Badges Earned</li>
              <li>Login Statistics</li>
            </ul>
            <p>Best regards,<br>Marillac Place System</p>
          </body>
        </html>
      `,
      attachments: [
        {
          filename,
          content: csvContent,
          contentType: "text/csv",
        },
      ],
    });
    return true;
  } catch (err) {
    console.error(`Error sending email to ${to}:`, err);
    return false;
  }
}

export async function sendWeeklyReports(): Promise<boolean> {
  try {
    // Get all recipients who want weekly reports
    const recipients = await (prisma as any).reportRecipient.findMany({
      where: { weekly: true },
    });

    if (recipients.length === 0) {
      console.log("No weekly report recipients found");
      return true;
    }

    console.log(`Found ${recipients.length} recipient(s) for weekly reports`);

    // Generate report
    const csvContent = await generateWeeklyReportCSV();
    if (!csvContent) {
      console.error("Failed to generate weekly report CSV");
      return false;
    }

    const today = formatDateTime(new Date(), false);
    const reportPeriod = `Weekly Report (${today})`;

    // Send emails to all recipients
    const emailResults = await Promise.all(
      recipients.map(async (recipient: any) => {
        const sent = await sendReportEmail(
          recipient.email,
          `Weekly Report - ${today}`,
          csvContent,
          reportPeriod,
          "weekly"
        );

        if (sent) {
          // Update last report sent date
          await (prisma as any).reportRecipient.update({
            where: { report_recipient_id: recipient.report_recipient_id },
            data: { last_report_sent: today },
          });
          console.log(`✅ Weekly report sent to ${recipient.email}`);
          return true;
        }
        console.error(`❌ Failed to send weekly report to ${recipient.email}`);
        return false;
      })
    );

    const successCount = emailResults.filter(Boolean).length;
    console.log(`Weekly reports sent: ${successCount}/${recipients.length}`);
    return successCount > 0;
  } catch (err) {
    console.error("Error sending weekly reports:", err);
    return false;
  }
}

export async function sendMonthlyReports(): Promise<boolean> {
  try {
    // Get all recipients who want monthly reports
    const recipients = await (prisma as any).reportRecipient.findMany({
      where: { monthly: true },
    });

    if (recipients.length === 0) {
      console.log("No monthly report recipients found");
      return true;
    }

    console.log(`Found ${recipients.length} recipient(s) for monthly reports`);

    // Generate report
    const csvContent = await generateMonthlyReportCSV();
    if (!csvContent) {
      console.error("Failed to generate monthly report CSV");
      return false;
    }

    const today = formatDateTime(new Date(), false);
    const reportPeriod = `Monthly Report (${today})`;

    // Send emails to all recipients
    const emailResults = await Promise.all(
      recipients.map(async (recipient: any) => {
        const sent = await sendReportEmail(
          recipient.email,
          `Monthly Report - ${today}`,
          csvContent,
          reportPeriod,
          "monthly"
        );

        if (sent) {
          // Update last report sent date
          await (prisma as any).reportRecipient.update({
            where: { report_recipient_id: recipient.report_recipient_id },
            data: { last_report_sent: today },
          });
          console.log(`✅ Monthly report sent to ${recipient.email}`);
          return true;
        }
        console.error(`❌ Failed to send monthly report to ${recipient.email}`);
        return false;
      })
    );

    const successCount = emailResults.filter(Boolean).length;
    console.log(`Monthly reports sent: ${successCount}/${recipients.length}`);
    return successCount > 0;
  } catch (err) {
    console.error("Error sending monthly reports:", err);
    return false;
  }
}
