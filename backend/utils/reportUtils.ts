import { GoalAction, Level, TaskStatus, TransactionType } from "@prisma/client";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import db from "../prisma";

export enum ReportType {
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
}

interface PraiseWithARaiseTask {
  participantId: number;
  taskName: string;
  taskStatus: TaskStatus;
  date: string;
  value: number;
  comments: string;
}

interface ParticipantInformation {
  participantId: number;
  accountCreationDate: string;
  accountRemovalDate: string;
}

interface FinancialInformation {
  participantId: number;
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
}

interface Badges {
  participantId: number;
  issueDate: string;
  badgeEarned: string;
  level: Level;
  description: string;
}

interface LoginStats {
  participantId: number;
  loginDate: string;
}

interface EarningGoal {
  participantId: number;
  goalAction: GoalAction;
  value: number;
  date: string;
}

interface DataReport {
  type: ReportType;
  date: string;
  praiseWithARaiseTasks: PraiseWithARaiseTask[];
  participantInformation: ParticipantInformation[];
  financialInformation: FinancialInformation[];
  badges: Badges[];
  loginStats: LoginStats[];
  earningGoal: EarningGoal[];
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

function calculateDateRange(type: ReportType) {
  if (type === ReportType.WEEKLY) {
    const startDate = startOfWeek(new Date());
    const endDate = endOfWeek(new Date());
    return { startDate, endDate };
  }

  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  return { startDate, endDate };
}

export function jsonToCsv(data: object[], headers: string[]): string {
  if (data.length === 0) return `${headers.join(",")}\n`;
  const csvRows = [headers.join(",")];
  const rows = data.map((row) => {
    const values = headers.map((header) => {
      const value = (row as Record<string, unknown>)[header];
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

export async function generateDataReport(
  type: ReportType
): Promise<DataReport | null> {
  const { startDate, endDate } = calculateDateRange(type);
  try {
    const praiseWithARaiseTasks = await db.assignedTask.findMany({
      where: {
        status: { not: TaskStatus.ASSIGNED },
        start_date: {
          lte: endDate,
          gte: startDate,
        },
      },
      orderBy: [{ pid: "asc" }, { start_date: "desc" }],
    });

    const participantInformation = await db.participant.findMany({
      where: {
        OR: [
          {
            arrival: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            departure: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      orderBy: { pid: "asc" },
    });

    const financialInformation = await db.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ pid: "asc" }, { date: "desc" }],
    });

    const badges = await db.achievedBadgeLevel.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        pid: true,
        date: true,
        name: true,
        level: true,
        badge_level: {
          select: {
            system_badge: {
              select: {
                description: true,
              },
            },
          },
        },
      },
      orderBy: [{ pid: "asc" }, { date: "desc" }],
    });

    const loginStats = await db.loginHistory.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ pid: "asc" }, { date: "desc" }],
    });

    const earningGoal = await db.earningGoal.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ pid: "asc" }, { date: "desc" }],
    });

    const report: DataReport = {
      type,
      date: dateFormatter.format(startDate),
      praiseWithARaiseTasks: praiseWithARaiseTasks.map((task) => ({
        participantId: task.pid,
        taskName: task.name,
        taskStatus: task.status,
        date: dateFormatter.format(task.start_date),
        value: task.value,
        comments: task.comment ?? "",
      })),
      participantInformation: participantInformation.map((participant) => ({
        participantId: participant.pid,
        accountCreationDate: dateFormatter.format(participant.arrival),
        accountRemovalDate: participant.departure
          ? dateFormatter.format(participant.departure)
          : "",
      })),
      financialInformation: financialInformation.map((transaction) => ({
        participantId: transaction.pid,
        transactionDate: dateFormatter.format(transaction.date),
        transactionType: transaction.type,
        amount: transaction.amount,
      })),
      badges: badges.map((badge) => ({
        participantId: badge.pid,
        issueDate: dateFormatter.format(badge.date),
        badgeEarned: badge.name,
        level: badge.level,
        description: badge.badge_level.system_badge.description,
      })),
      loginStats: loginStats.map((login) => ({
        participantId: login.pid,
        loginDate: dateFormatter.format(login.date),
      })),
      earningGoal: earningGoal.map((goal) => ({
        participantId: goal.pid,
        goalAction: goal.action,
        value: goal.value,
        date: dateFormatter.format(goal.date),
      })),
    };

    return report;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function formatDataReport(report: DataReport): string {
  const csvSections: string[] = [];

  csvSections.push(`${report.type} Report,${report.date}`);
  csvSections.push("");

  csvSections.push("=== PRAISE WITH A RAISE TASKS ===");
  csvSections.push(
    jsonToCsv(report.praiseWithARaiseTasks, [
      "participantId",
      "taskName",
      "taskStatus",
      "date",
      "value",
      "comments",
    ])
  );

  csvSections.push("=== PARTICIPANT INFORMATION ===");
  csvSections.push(
    jsonToCsv(report.participantInformation, [
      "participantId",
      "accountCreationDate",
      "accountRemovalDate",
    ])
  );

  csvSections.push("=== FINANCIAL INFORMATION ===");
  csvSections.push(
    jsonToCsv(report.financialInformation, [
      "participantId",
      "transactionDate",
      "transactionType",
      "amount",
    ])
  );

  csvSections.push("=== BADGES ===");
  csvSections.push(
    jsonToCsv(report.badges, [
      "participantId",
      "issueDate",
      "badgeEarned",
      "level",
      "description",
    ])
  );

  csvSections.push("=== LOGIN STATS ===");
  csvSections.push(
    jsonToCsv(report.loginStats, ["participantId", "loginDate"])
  );

  csvSections.push("=== EARNING GOAL ===");
  csvSections.push(
    jsonToCsv(report.earningGoal, [
      "participantId",
      "goalAction",
      "value",
      "date",
    ])
  );

  return csvSections.join("\n");
}
