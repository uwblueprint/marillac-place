import { ReportRecipient } from "@prisma/client";
import db from "../../prisma";

const reportRecipientResolver = {
  Query: {
    getReportRecipients: async (): Promise<ReportRecipient[]> => {
      return db.reportRecipient.findMany({
        orderBy: { email: "asc" },
      });
    },
  },
  Mutation: {
    createReportRecipient: async (
      _parent: undefined,
      {
        email,
        weekly,
        monthly,
      }: {
        email: string;
        weekly: boolean;
        monthly: boolean;
      }
    ): Promise<ReportRecipient> => {
      return db.reportRecipient.create({
        data: { email, weekly, monthly },
      });
    },
    updateReportRecipient: async (
      _parent: undefined,
      {
        email,
        weekly,
        monthly,
      }: {
        email: string;
        weekly?: boolean;
        monthly?: boolean;
      }
    ): Promise<ReportRecipient> => {
      const updates: Partial<ReportRecipient> = {};
      if (weekly !== undefined) updates.weekly = weekly;
      if (monthly !== undefined) updates.monthly = monthly;

      const isEmpty = Object.keys(updates).length === 0;
      if (isEmpty) throw new Error("no updates received");

      return db.reportRecipient.update({
        where: { email },
        data: updates,
      });
    },
    deleteReportRecipient: async (
      _parent: undefined,
      {
        email,
      }: {
        email: string;
      }
    ): Promise<ReportRecipient> => {
      return db.reportRecipient.delete({
        where: { email },
      });
    },
  },
};

export default reportRecipientResolver;
