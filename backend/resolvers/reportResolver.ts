/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import prisma from "../prisma";
/* eslint-disable */
const reportResolver = {
  Query: {
    getReportRecipients: async (): Promise<any[]> => {
      return await prisma.reportRecipient.findMany({
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
      }: { email: string; weekly: boolean; monthly: boolean }
    ): Promise<boolean> => {
      try {
        await prisma.reportRecipient.create({
          data: { email, weekly, monthly },
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    updateReportRecipient: async (
      _parent: undefined,
      {
        report_recipient_id,
        email,
        weekly,
        monthly,
      }: {
        report_recipient_id: number;
        email?: string;
        weekly?: boolean;
        monthly?: boolean;
      }
    ): Promise<boolean> => {
      try {
        const updateData: any = {};
        if (email !== undefined) updateData.email = email;
        if (weekly !== undefined) updateData.weekly = weekly;
        if (monthly !== undefined) updateData.monthly = monthly;

        await prisma.reportRecipient.update({
          where: { report_recipient_id },
          data: updateData,
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    deleteReportRecipient: async (
      _parent: undefined,
      { report_recipient_id }: { report_recipient_id: number }
    ): Promise<boolean> => {
      try {
        await prisma.reportRecipient.delete({
          where: { report_recipient_id },
        });
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  },
};

export default reportResolver;
