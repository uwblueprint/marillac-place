import prisma from "../../prisma";

interface DataReportParams {
  startDate: string; //format YY-MM-DD
  endDate: string; // format YY-MM-DD
  outputPath?: string;
}

interface PraiseWithRaiseTask {
  participant_id: number;
  task_name: string;
  task_staus: string;
  date: string;
  value: number;
  comments: string | null;
}

interface ParticipantInfo {
  participant_id: number;
  account_creation_date: string;
  account_removal_date: string | null;
}

interface FinanicalInfo {
  participant_id: number;
  transaction_date: string;
  transaction_type: string;
  amount: number;
}

interface BadgeInfo {
  participant_id: number;
  issue_date: string;
  badge_earned: string;
  level: number;
  description: string;
}

interface LoginStats {
  participant_id: number;
  login_date: string;
}

interface DataReport {
  reportReport: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  praiseWithRaiseTask: PraiseWithRaiseTask[];
  participantInfo: ParticipantInfo[];
  financialInfo: FinanicalInfo[];
  badges: BadgeInfo[];
  loginStat: LoginStats[];
}

//Note this is AI generated - confirm with client and clean up formatting

// Main function to generate a json  for data report
async function generateDataReport(
  params: DataReportParams,
): Promise<DataReport | null> {
  try {
    const startDateString = params.startDate;
    const endDateString = params.endDate;

    // Validate date format and validity
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDateString) || !dateRegex.test(endDateString)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD format.");
    }

    // Validate that dates are actually valid dates
    const startDateObj = new Date(`${startDateString}T00:00:00.000Z`);
    const endDateObj = new Date(`${endDateString}T00:00:00.000Z`);

    // Check if the date string actually represents the same date when parsed
    if (
      startDateObj.toISOString().slice(0, 10) !== startDateString ||
      endDateObj.toISOString().slice(0, 10) !== endDateString
    ) {
      throw new Error(
        "Invalid date values. Please provide valid dates in YYYY-MM-DD format.",
      );
    }

    if (
      Number.isNaN(startDateObj.getTime()) ||
      Number.isNaN(endDateObj.getTime())
    ) {
      throw new Error(
        "Invalid date values. Please provide valid dates in YYYY-MM-DD format.",
      );
    }

    // Validate that start date is before or equal to end date
    if (startDateObj > endDateObj) {
      throw new Error("Start date must be before or equal to end date.");
    }

    console.log(
      `Generating report from ${startDateString} to ${endDateString}`,
    );

    // 1. Praise With A Raise Tasks - from AssignedTask table
    const praiseWithRaiseTasks = await prisma.assignedTask.findMany({
      where: {
        start_date: {
          gte: startDateString,
          lte: endDateString,
        },
      },
      select: {
        participant_id: true,
        task_name: true,
        task_status: true,
        start_date: true,
        marillac_bucks_addition: true,
        comment: true,
      },
    });

    // 2. Participant Information - from Participant table
    const participantInfo = await prisma.participant.findMany({
      where: {
        OR: [
          {
            account_creation_date: {
              gte: startDateString,
              lte: endDateString,
            },
          },
          {
            account_removal_date: {
              gte: startDateString,
              lte: endDateString,
            },
          },
        ],
      },
      select: {
        participant_id: true,
        account_creation_date: true,
        account_removal_date: true,
      },
    });

    // 3. Financial Information - from Transaction table
    const financialInfo = await prisma.transaction.findMany({
      where: {
        transaction_date: {
          gte: startDateString,
          lte: endDateString,
        },
      },
      select: {
        participant_id: true,
        transaction_date: true,
        transaction_type: true,
        marillac_bucks: true,
      },
    });

    // 4. Badges - from EarnedBadge table
    const badges = await prisma.earnedBadge.findMany({
      where: {
        date_received: {
          gte: startDateString,
          lte: endDateString,
        },
      },
      select: {
        participant_id: true,
        date_received: true,
        name: true,
        level: true,
        description: true,
      },
    });

    // 5. Login Stats - from Login table
    const loginStats = await prisma.login.findMany({
      where: {
        login_date: {
          gte: startDateString,
          lte: endDateString,
        },
      },
      select: {
        participant_id: true,
        login_date: true,
      },
    });

    // Format the data
    const report: DataReport = {
      reportPeriod: `Custom report (${startDateString} to ${endDateString})`,
      startDate: startDateString,
      endDate: endDateString,
      generatedAt: new Date().toISOString(),
      praiseWithRaiseTasks: praiseWithRaiseTasks.map((task) => ({
        participant_id: task.participant_id,
        task_name: task.task_name,
        task_status: task.task_status,
        date: task.start_date,
        value: task.marillac_bucks_addition,
        comments: task.comment,
      })),
      participantInfo: participantInfo.map((participant) => ({
        participant_id: participant.participant_id,
        account_creation_date: participant.account_creation_date,
        account_removal_date: participant.account_removal_date,
      })),
      financialInfo: financialInfo.map((transaction) => ({
        participant_id: transaction.participant_id,
        transaction_date: transaction.transaction_date,
        transaction_type: transaction.transaction_type,
        amount: transaction.marillac_bucks,
      })),
      badges: badges.map((badge) => ({
        participant_id: badge.participant_id,
        issue_date: badge.date_received,
        badge_earned: badge.name,
        level: badge.level,
        description: badge.description,
      })),
      loginStats: loginStats.map((login) => ({
        participant_id: login.participant_id,
        login_date: login.login_date,
      })),
    };

    // Log summary statistics
    console.log(`Report data for (${startDateString} to ${endDateString}):`);
    console.log(`- Tasks: ${report.praiseWithRaiseTasks.length}`);
    console.log(`- Participant Info Records: ${report.participantInfo.length}`);
    console.log(`- Financial Transactions: ${report.financialInfo.length}`);
    console.log(`- Badges Earned: ${report.badges.length}`);
    console.log(`- Login Records: ${report.loginStats.length}`);

    // save to file if outputPath is provided
    if (params.outputPath) {
      const fs = await import("fs/promises");
      await fs.writeFile(params.outputPath, JSON.stringify(report, null, 2));
      console.log(`Report saved to: ${params.outputPath}`);
    }

    return report;
  } catch (err) {
    console.error(
      `Error generating data report (${params.startDate} to ${params.endDate}):`,
      err,
    );
    return null;
  }
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

// Wrapper functions for cron jobs
export async function generateWeeklyReport(): Promise<boolean> {
  const { startDate, endDate } = calculateDateRange("week");
  const report = await generateDataReport({ startDate, endDate });
  return report !== null;
}

export async function generateMonthlyReport(): Promise<boolean> {
  const { startDate, endDate } = calculateDateRange("month");
  const report = await generateDataReport({ startDate, endDate });
  return report !== null;
}

// Export the main function for generating a data report by default
export default generateDataReport;
