import { GoalAction } from "@prisma/client";
import db from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { MONEY_EARNED } from "../constants/systemBadges";
import { current } from "./dateUtils";

export default async function processEarning(
  pid: number,
  amount: number,
  reason: string
) {
  if (amount <= 0) throw new Error("invalid amount");

  const participant = await db.participant.findUnique({
    where: { pid },
  });
  if (!participant) throw new Error("participant not found");

  const newBalance = participant.balance + amount;
  const newEarnings = participant.total_earnings + amount;
  await db.participant.update({
    where: { pid },
    data: {
      balance: newBalance,
      total_earnings: newEarnings,
    },
  });

  const earningGoal = await db.earningGoal.findFirst({
    where: { pid },
    orderBy: [{ date: "desc" }],
  });
  if (
    earningGoal !== null &&
    earningGoal.action !== GoalAction.REACHED &&
    earningGoal.value <= newEarnings
  ) {
    await db.earningGoal.create({
      data: { pid, action: GoalAction.REACHED, value: earningGoal.value, date: current() },
    });
  }

  await db.transaction.create({
    data: { pid, amount, reason, date: current() },
  });

  await updateBadgeLevelProgress(MONEY_EARNED, pid, amount);
}
