import { GoalAction, Prisma } from "@prisma/client";
import db from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { MONEY_EARNED } from "../constants/systemBadges";

export default async function processEarning(
  pid: number,
  amount: number,
  reason: string,
  transactionClient: Prisma.TransactionClient = db
) {
  if (amount <= 0) throw new Error("invalid amount");

  const participant = await transactionClient.participant.findUnique({
    where: { pid },
  });
  if (!participant) throw new Error("participant not found");

  const newBalance = participant.balance + amount;
  const newEarnings = participant.total_earnings + amount;
  await transactionClient.participant.update({
    where: { pid },
    data: {
      balance: newBalance,
      total_earnings: newEarnings,
    },
  });

  const earningGoal = await transactionClient.earningGoal.findFirst({
    where: { pid },
    orderBy: [{ date: "desc" }],
  });
  if (
    earningGoal !== null &&
    earningGoal.action !== GoalAction.REACHED &&
    earningGoal.value <= newEarnings
  ) {
    await transactionClient.earningGoal.create({
      data: { pid, action: GoalAction.REACHED, value: earningGoal.value },
    });
  }

  await transactionClient.transaction.create({
    data: { pid, amount, reason },
  });

  await updateBadgeLevelProgress(MONEY_EARNED, pid, amount, transactionClient);
}
