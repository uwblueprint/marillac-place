import generateDataReport from "./generateDataReport";
import path from "path";
import fs from "fs/promises";

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

// Enhanced versions that save reports to files
export async function generateWeeklyReportWithFile(): Promise<boolean> {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../../../reports");
    await fs.mkdir(reportsDir, { recursive: true });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = path.join(reportsDir, `weekly-report-${timestamp}.json`);

    const { startDate, endDate } = calculateDateRange("week");
    const report = await generateDataReport({
      startDate,
      endDate,
      outputPath: filename,
    });

    if (report) {
      console.log(`📁 Weekly report saved to: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error generating weekly report with file:", error);
    return false;
  }
}

export async function generateMonthlyReportWithFile(): Promise<boolean> {
  try {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../../../reports");
    await fs.mkdir(reportsDir, { recursive: true });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = path.join(reportsDir, `monthly-report-${timestamp}.json`);

    const { startDate, endDate } = calculateDateRange("month");
    const report = await generateDataReport({
      startDate,
      endDate,
      outputPath: filename,
    });

    if (report) {
      console.log(`📁 Monthly report saved to: ${filename}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error generating monthly report with file:", error);
    return false;
  }
}
