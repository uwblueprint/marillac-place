import { GoalAction } from "@prisma/client";
import { DbClient } from "../prisma";
import { updateBadgeLevelProgress } from "./badgeUtils";
import { MONEY_EARNED } from "../constants/systemBadges";

export default async function processEarning(
  client: DbClient,
  pid: number,
  amount: number,
  reason: string
) {
  if (amount <= 0) throw new Error("invalid amount");

  const participant = await client.participant.findUnique({
    where: { pid },
  });
  if (!participant) throw new Error("participant not found");

  const newBalance = participant.balance + amount;
  const newEarnings = participant.total_earnings + amount;
  await client.participant.update({
    where: { pid },
    data: {
      balance: newBalance,
      total_earnings: newEarnings,
    },
  });

  const earningGoal = await client.earningGoal.findFirst({
    where: { pid },
    orderBy: [{ date: "desc" }],
  });
  if (
    earningGoal !== null &&
    earningGoal.action !== GoalAction.REACHED &&
    earningGoal.value <= newEarnings
  ) {
    await client.earningGoal.create({
      data: { pid, action: GoalAction.REACHED, value: earningGoal.value },
    });
  }

  await client.transaction.create({
    data: { pid, amount, reason },
  });

  await updateBadgeLevelProgress(client, MONEY_EARNED, pid, amount);
}
