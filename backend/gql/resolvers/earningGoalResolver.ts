import { EarningGoal, GoalAction } from "@prisma/client";
import db from "../../prisma";
import { current } from "../../utils/dateUtils";

const earningGoalResolver = {
  Query: {
    getEarningGoal: async (
      _parent: undefined,
      { pid }: { pid: number }
    ): Promise<EarningGoal | null> => {
      return db.earningGoal.findFirst({
        where: { pid },
        orderBy: [{ date: "desc" }],
      });
    },
  },
  Mutation: {
    createEarningGoal: async (
      _parent: undefined,
      {
        pid,
        action,
        value,
      }: {
        pid: number;
        action: GoalAction;
        value: number;
      }
    ): Promise<EarningGoal> => {
      return db.earningGoal.create({
        data: { pid, action, value, date: current() },
      });
    },
    updateEarningGoal: async (
      _parent: undefined,
      {
        pid,
        date,
        value,
      }: {
        pid: number;
        date: string;
        value: number;
      }
    ): Promise<EarningGoal> => {
      return db.earningGoal.update({
        where: {
          pid_date: { pid, date },
        },
        data: { value },
      });
    },
  },
};

export default earningGoalResolver;
