import nodemailer from "nodemailer";
import { ReportType } from "./reportUtils";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReportEmail(
  to: string,
  csvContent: string,
  reportType: ReportType
) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${reportType.toLowerCase()}-report-${timestamp}.csv`;

    const firstLine = csvContent.split("\n")[0];
    const date = firstLine.split(",")[1];

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `${reportType} Report [${date}]`,
      text: `Please find the ${reportType.toLowerCase()} attached as a CSV file.\n\nThis report contains comprehensive data for the reporting period.\n\nBest regards,\nMarillac Place System`,
      html: `
        <html>
          <body>
            <h2>🎉 Your ${reportType} Report is Here!</h2>
            <p>Please find the ${reportType.toLowerCase()} attached as a CSV file.</p>
            <p>This report contains comprehensive data including:</p>
            <ul>
              <li>Praise With A Raise Tasks 📌</li>
              <li>Participant Information 👥</li>
              <li>Financial Information 💵</li>
              <li>Badges 🏅</li>
              <li>Login Stats 📊</li>
              <li>Earning Goal ⭐️</li>
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
  } catch (err) {
    console.error(err);
  }
}
