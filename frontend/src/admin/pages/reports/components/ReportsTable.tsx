import React from "react";
import { useMutation } from "@apollo/client";
import { Trash } from "../../../../ui/icons/ActionIcons";
import DataTable, { Row } from "../../../../ui/misc/DataTable";
import ToggleButton from "../../../../ui/buttons/ToggleButton";
import {
  DELETE_REPORT_RECIPIENT,
  UPDATE_REPORT_RECIPIENT,
} from "../../../../gql/reportRecipientRequests";
import useNotification from "../../../../hooks/useNotification";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

type ReportsTableProps = {
  reports: Report[];
  refetch: () => void;
};

export default function ReportsTable({ reports, refetch }: ReportsTableProps) {
  const [updateReportRecipient, { loading: updateReportRecipientLoading }] =
    useMutation(UPDATE_REPORT_RECIPIENT);
  const [deleteReportRecipient, { loading: deleteReportRecipientLoading }] =
    useMutation(DELETE_REPORT_RECIPIENT);
  const { sendNotification } = useNotification();

  const handleChangeWeekly = async (email: string, weekly: boolean) => {
    try {
      await updateReportRecipient({
        variables: {
          email,
          weekly,
        },
      });
      refetch();
      sendNotification("Weekly report frequency updated successfully");
    } catch (err) {
      console.error("Error updating report recipient:", err);
    }
  };

  const handleChangeMonthly = async (email: string, monthly: boolean) => {
    try {
      await updateReportRecipient({
        variables: {
          email,
          monthly,
        },
      });
      refetch();
      sendNotification("Monthly report frequency updated successfully");
    } catch (err) {
      console.error("Error updating report recipient:", err);
    }
  };

  const handleDeleteEmail = async (email: string) => {
    try {
      await deleteReportRecipient({
        variables: {
          email,
        },
      });
      refetch();
      sendNotification("Email deleted successfully");
    } catch (err) {
      console.error("Error deleting report recipient:", err);
    }
  };

  const columns = [
    { header: "Email", width: "35%" },
    { header: "Weekly", width: "20%", center: true },
    { header: "Monthly", width: "20%", center: true },
    { header: "", width: "5%", center: true },
  ];

  const rows: Row[][] = reports.map((report: Report) => [
    {
      element: report.email,
    },
    {
      element: <ToggleButton active={report.weekly} setActive={() => {}} />,
      action: async () => handleChangeWeekly(report.email, !report.weekly),
    },
    {
      element: <ToggleButton active={report.monthly} setActive={() => {}} />,
      action: async () => handleChangeMonthly(report.email, !report.monthly),
    },
    {
      element: <Trash size={20} />,
      action: async () => handleDeleteEmail(report.email),
    },
  ]);

  return (
    <DataTable
      loading={updateReportRecipientLoading || deleteReportRecipientLoading}
      columns={columns}
      rows={rows}
    />
  );
}
