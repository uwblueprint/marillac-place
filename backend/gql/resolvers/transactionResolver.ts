import { Transaction, TransactionType, DayOfWeek } from "@prisma/client";
import { endOfWeek, startOfWeek } from "date-fns";
import db from "../../prisma";
import { orderedDays } from "../../constants/days";

type GetWeeklyEarningsResponse = Record<DayOfWeek, number>;

const transactionResolver = {
  Query: {
    getWeeklyEarnings: async (
      _parent: undefined,
      {
        pid,
      }: {
        pid: number;
      }
    ): Promise<GetWeeklyEarningsResponse> => {
      const transactions = await db.transaction.findMany({
        where: {
          pid,
          type: TransactionType.EARNING,
          date: {
            gte: startOfWeek(new Date()),
            lte: endOfWeek(new Date()),
          },
        },
      });

      const totals: GetWeeklyEarningsResponse = {
        [DayOfWeek.SUNDAY]: 0,
        [DayOfWeek.MONDAY]: 0,
        [DayOfWeek.TUESDAY]: 0,
        [DayOfWeek.WEDNESDAY]: 0,
        [DayOfWeek.THURSDAY]: 0,
        [DayOfWeek.FRIDAY]: 0,
        [DayOfWeek.SATURDAY]: 0,
      };

      transactions.forEach((transaction) => {
        const day = orderedDays[new Date(transaction.date).getDay()];
        totals[day] += transaction.amount;
      });

      return totals;
    },
  },
  Mutation: {
    updateBalance: async (
      _parent: undefined,
      {
        pid,
        amount,
        reason,
      }: {
        pid: number;
        amount: number;
        reason: string;
      }
    ): Promise<Transaction> => {
      if (amount === 0) throw new Error("invalid amount");

      const participant = await db.participant.findUnique({
        where: { pid },
      });
      if (!participant) throw new Error("participant not found");

      const newBalance = participant.balance + amount;
      await db.participant.update({
        where: { pid },
        data: { balance: newBalance },
      });

      const type =
        amount < 0 ? TransactionType.PURCHASE : TransactionType.REFUND;
      return db.transaction.create({
        data: { pid, amount: Math.abs(amount), type, reason },
      });
    },
  },
};

export default transactionResolver;
