import path from "path";
import fs from "fs/promises";
import { generateDataReport, DataReport } from "./generateDataReport";

// Convert JSON data to CSV format
function jsonToCsv(data: object[], headers: string[]): string {
  if (data.length === 0) return `${headers.join(",")}\n`;

  const csvRows = [headers.join(",")];

  const rows = data.map((row) => {
    const values = headers.map((header) => {
      const value = (row as Record<string, unknown>)[header];
      // Escape commas and quotes in CSV
      if (
        typeof value === "string" &&
        (value.includes(",") || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? "";
    });
    return values.join(",");
  });
  csvRows.push(...rows);

  return `${csvRows.join("\n")}\n`;
}

// Generate a single comprehensive CSV with all data types
function generateComprehensiveCSV(report: DataReport): string {
  const csvSections: string[] = [];

  // Report header information
  csvSections.push(`Report Period,${report.reportPeriod}`);
  csvSections.push(`Generated At,${report.generatedAt}`);
  csvSections.push(""); // Empty line

  // 1. Praise With A Raise Tasks Section
  csvSections.push("=== PRAISE WITH A RAISE TASKS ===");
  if (report.praiseWithRaiseTasks.length > 0) {
    const tasksCSV = jsonToCsv(report.praiseWithRaiseTasks, [
      "participant_id",
      "task_name",
      "task_status",
      "date",
      "value",
      "comments",
    ]);
    csvSections.push(tasksCSV);
  } else {
    csvSections.push("No tasks found for this period");
    csvSections.push("");
  }

  // 2. Participant Information Section
  csvSections.push("=== PARTICIPANT INFORMATION ===");
  if (report.participantInfo.length > 0) {
    const participantsCSV = jsonToCsv(report.participantInfo, [
      "participant_id",
      "account_creation_date",
      "account_removal_date",
    ]);
    csvSections.push(participantsCSV);
  } else {
    csvSections.push("No participant changes found for this period");
    csvSections.push("");
  }

  // 3. Financial Information Section
  csvSections.push("=== FINANCIAL TRANSACTIONS ===");
  if (report.financialInfo.length > 0) {
    const financialCSV = jsonToCsv(report.financialInfo, [
      "participant_id",
      "transaction_date",
      "transaction_type",
      "amount",
    ]);
    csvSections.push(financialCSV);
  } else {
    csvSections.push("No financial transactions found for this period");
    csvSections.push("");
  }

  // 4. Badges Section
  csvSections.push("=== BADGES EARNED ===");
  if (report.badges.length > 0) {
    const badgesCSV = jsonToCsv(report.badges, [
      "participant_id",
      "issue_date",
      "badge_earned",
      "level",
      "description",
    ]);
    csvSections.push(badgesCSV);
  } else {
    csvSections.push("No badges earned for this period");
    csvSections.push("");
  }

  // 5. Login Statistics Section
  csvSections.push("=== LOGIN STATISTICS ===");
  if (report.loginStats.length > 0) {
    const loginsCSV = jsonToCsv(report.loginStats, [
      "participant_id",
      "login_date",
    ]);
    csvSections.push(loginsCSV);
  } else {
    csvSections.push("No login records found for this period");
    csvSections.push("");
  }

  // Summary Section
  csvSections.push("=== SUMMARY ===");
  csvSections.push("Data Type,Count");
  csvSections.push(
    `Praise With A Raise Tasks,${report.praiseWithRaiseTasks.length}`
  );
  csvSections.push(`Participant Info Records,${report.participantInfo.length}`);
  csvSections.push(`Financial Transactions,${report.financialInfo.length}`);
  csvSections.push(`Badges Earned,${report.badges.length}`);
  csvSections.push(`Login Records,${report.loginStats.length}`);

  return csvSections.join("\n");
}

// Helper function to calculate date ranges
function calculateDateRange(period: "week" | "month"): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const startDate = new Date();

  if (period === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (period === "month") {
    startDate.setMonth(now.getMonth() - 1);
  }

  return {
    startDate: startDate.toLocaleDateString("en-ca"),
    endDate: now.toLocaleDateString("en-ca"),
  };
}

export async function generateWeeklyReportCSV(): Promise<string | null> {
  try {
    const reportsDir = path.join(__dirname, "../../../reports");
    await fs.mkdir(reportsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const { startDate, endDate } = calculateDateRange("week");
    const report = await generateDataReport({ startDate, endDate });

    if (!report) return null;

    // Generate single comprehensive CSV file
    const filename = `weekly-report-${timestamp}.csv`;
    const csvContent = generateComprehensiveCSV(report);

    const filePath = path.join(reportsDir, filename);
    await fs.writeFile(filePath, csvContent);

    // Also save the complete JSON report as backup
    await fs.writeFile(
      path.join(reportsDir, `weekly-report-${timestamp}-complete.json`),
      JSON.stringify(report, null, 2)
    );

    console.log(`Weekly CSV report saved to: ${filePath}`);
    return csvContent;
  } catch (error) {
    console.error("Error generating weekly CSV report:", error);
    return null;
  }
}

export async function generateMonthlyReportCSV(): Promise<string | null> {
  try {
    const reportsDir = path.join(__dirname, "../../../reports");
    await fs.mkdir(reportsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const { startDate, endDate } = calculateDateRange("month");
    const report = await generateDataReport({ startDate, endDate });

    if (!report) return null;

    // Generate single comprehensive CSV file
    const filename = `monthly-report-${timestamp}.csv`;
    const csvContent = generateComprehensiveCSV(report);

    const filePath = path.join(reportsDir, filename);
    await fs.writeFile(filePath, csvContent);

    // Also save the complete JSON report as backup
    await fs.writeFile(
      path.join(reportsDir, `monthly-report-${timestamp}-complete.json`),
      JSON.stringify(report, null, 2)
    );

    console.log(`Monthly CSV report saved to: ${filePath}`);
    return csvContent;
  } catch (error) {
    console.error("Error generating monthly CSV report:", error);
    return null;
  }
}
