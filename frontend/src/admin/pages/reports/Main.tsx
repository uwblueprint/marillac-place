import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import ReportsTable from "./components/ReportsTable";
import AddEmailModal from "./components/AddEmailModal";
import EditEmailModal from "./components/EditEmailModal";

export default function AdminReportsPage() {
  const [addEmail, setAddEmail] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Mock data for now - this would come from GraphQL queries
  const [reports, setReports] = useState([
    {
      id: 1,
      email: "admin@marillacplace.org",
      weekly: true,
      monthly: true,
      lastReportSent: "2024-01-15",
    },
    {
      id: 2,
      email: "director@marillacplace.org",
      weekly: true,
      monthly: false,
      lastReportSent: "2024-01-14",
    },
    {
      id: 3,
      email: "supervisor@marillacplace.org",
      weekly: false,
      monthly: true,
      lastReportSent: "2024-01-01",
    },
    {
      id: 4,
      email: "coordinator@marillacplace.org",
      weekly: true,
      monthly: true,
      lastReportSent: "2024-01-13",
    },
  ]);

  const handleAddEmail = (emailData: any) => {
    const newEmail = {
      id: reports.length + 1,
      ...emailData,
    };
    setReports([...reports, newEmail]);
    setAddEmail(false);
  };

  const handleEditEmail = (emailData: any) => {
    setReports(
      reports.map((report) =>
        report.id === selectedEmail.id ? { ...report, ...emailData } : report
      )
    );
    setEditEmail(false);
    setSelectedEmail(null);
  };

  const handleDeleteEmail = (id: number) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  const handleToggleWeekly = (id: number, weekly: boolean) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, weekly } : report
      )
    );
  };

  const handleToggleMonthly = (id: number, monthly: boolean) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, monthly } : report
      )
    );
  };

  const handleEditClick = (email: any) => {
    setSelectedEmail(email);
    setEditEmail(true);
  };

  return (
    <Flex width="100%" height="fit-content" flexDir="column" gap="15px">
      <Flex
        width="100%"
        height="fit-content"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="15px">
          <Text textStyle="web.h2" color="primary.700">
            Reports
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
            Reports will be automatically generated and emailed. Edit and select frequency of emails in the list below.
          </Text>
        </Flex>
      </Flex>
      
      <ReportsTable
        reports={reports}
        onAddEmail={() => setAddEmail(true)}
        onEditEmail={handleEditClick}
        onDeleteEmail={handleDeleteEmail}
        onToggleWeekly={handleToggleWeekly}
        onToggleMonthly={handleToggleMonthly}
      />

      {addEmail && (
        <AddEmailModal
          onClose={() => setAddEmail(false)}
          onSubmit={handleAddEmail}
        />
      )}
      
      {editEmail && selectedEmail && (
        <EditEmailModal
          email={selectedEmail}
          onClose={() => {
            setEditEmail(false);
            setSelectedEmail(null);
          }}
          onSubmit={handleEditEmail}
        />
      )}
    </Flex>
  );
}