/**
 * Test script to manually trigger report emails
 * 
 * ⚠️  IMPORTANT: Run this script INSIDE the Docker container!
 * 
 * Usage from outside Docker:
 *   docker exec -it mp_backend npx tsx test-report-emails.ts [weekly|monthly|both]
 *   
 *   Examples:
 *     docker exec -it mp_backend npx tsx test-report-emails.ts weekly
 *     docker exec -it mp_backend npx tsx test-report-emails.ts monthly
 *     docker exec -it mp_backend npx tsx test-report-emails.ts both
 *     docker exec -it mp_backend npx tsx test-report-emails.ts  (defaults to both)
 * 
 * Usage from inside Docker container:
 *   npm run test:reports weekly    - Send weekly reports
 *   npm run test:reports monthly   - Send monthly reports
 *   npm run test:reports both      - Send both weekly and monthly reports
 *   npm run test:reports           - Send both (default)
 * 
 * Prerequisites:
 *   1. Make sure Docker containers are running: docker-compose up
 *   2. Make sure you have SMTP environment variables set in backend/.env:
 *      - SMTP_HOST (defaults to smtp.gmail.com)
 *      - SMTP_PORT (defaults to 587)
 *      - SMTP_USER (your email username)
 *      - SMTP_PASSWORD (your email password/app password)
 *      - SMTP_FROM (optional, defaults to SMTP_USER)
 *   3. Ensure you have at least one email configured in the database
 *      with weekly: true and/or monthly: true
 */

import "dotenv/config";
import prisma from "./prisma";
import { sendWeeklyReports, sendMonthlyReports } from "./crons/scripts/sendReportEmails";

async function main() {
  const reportType = process.argv[2]?.toLowerCase() || "both";

  console.log("=".repeat(60));
  console.log("📧 Report Email Test Script");
  console.log("=".repeat(60));
  console.log(`Report type: ${reportType}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log("=".repeat(60));
  console.log("");

  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error("❌ SMTP configuration missing!");
    console.error("Please set SMTP_USER and SMTP_PASSWORD environment variables.");
    console.error("Optional: SMTP_HOST (defaults to smtp.gmail.com), SMTP_PORT (defaults to 587)");
    process.exit(1);
  }

  // Check for recipients
  try {
    const weeklyRecipients = await prisma.reportRecipient.findMany({
      where: { weekly: true },
    });
    const monthlyRecipients = await prisma.reportRecipient.findMany({
      where: { monthly: true },
    });

    if (reportType === "weekly" || reportType === "both") {
      if (weeklyRecipients.length === 0) {
        console.warn("⚠️  WARNING: No recipients found with weekly: true");
        console.warn("   Add recipients via the admin Reports page or database");
      } else {
        console.log(`✓ Found ${weeklyRecipients.length} weekly recipient(s):`);
        weeklyRecipients.forEach((r: any) => console.log(`  - ${r.email}`));
      }
    }

    if (reportType === "monthly" || reportType === "both") {
      if (monthlyRecipients.length === 0) {
        console.warn("⚠️  WARNING: No recipients found with monthly: true");
        console.warn("   Add recipients via the admin Reports page or database");
      } else {
        console.log(`✓ Found ${monthlyRecipients.length} monthly recipient(s):`);
        monthlyRecipients.forEach((r: any) => console.log(`  - ${r.email}`));
      }
    }
    console.log("");
  } catch (error) {
    console.error("❌ Error checking recipients:", error);
    console.error("Make sure the database is connected and the ReportRecipient table exists.");
    process.exit(1);
  }

  try {
    if (reportType === "weekly" || reportType === "both") {
      console.log("🔄 Testing weekly reports...");
      console.log("-".repeat(60));
      const weeklyResult = await sendWeeklyReports();
      if (weeklyResult) {
        console.log("✅ Weekly reports test completed successfully");
      } else {
        console.log("❌ Weekly reports test failed");
      }
      console.log("");
    }

    if (reportType === "monthly" || reportType === "both") {
      console.log("🔄 Testing monthly reports...");
      console.log("-".repeat(60));
      const monthlyResult = await sendMonthlyReports();
      if (monthlyResult) {
        console.log("✅ Monthly reports test completed successfully");
      } else {
        console.log("❌ Monthly reports test failed");
      }
      console.log("");
    }

    console.log("=".repeat(60));
    console.log("✨ Test script completed");
    console.log("=".repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error("💥 Error running test script:", error);
    process.exit(1);
  }
}

main();
