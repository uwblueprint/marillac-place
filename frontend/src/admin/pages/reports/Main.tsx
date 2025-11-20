import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";

import ReportsTable from "./components/ReportsTable";
import AddEmailModal from "./components/AddEmailModal";
import EditEmailModal from "./components/EditEmailModal";

import {
  GET_REPORT_RECIPIENTS,
  CREATE_REPORT_RECIPIENT,
  UPDATE_REPORT_RECIPIENT,
  DELETE_REPORT_RECIPIENT,
} from "../../../gql/reportRecipientRequests";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

export default function AdminReportsPage() {

  const [addEmail, setAddEmail] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Report | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_REPORT_RECIPIENTS);
  const [createReportRecipient] = useMutation(CREATE_REPORT_RECIPIENT);
  const [updateReportRecipient] = useMutation(UPDATE_REPORT_RECIPIENT);
  const [deleteReportRecipient] = useMutation(DELETE_REPORT_RECIPIENT);

  const reports: Report[] = data?.getReportRecipients || [];

  const handleAddEmail = async (emailData: {
    email: string;
    weekly: boolean;
    monthly: boolean;
  }) => {
    try {
      await createReportRecipient({
        variables: {
          email: emailData.email,
          weekly: emailData.weekly,
          monthly: emailData.monthly,
        },
      });
      refetch();
      setAddEmail(false); 
    } catch (err) {
      console.error("Error creating report recipient:", err);
    }
  };

  const handleEditEmail = async (emailData: {
    email: string;
    weekly: boolean;
    monthly: boolean;
  }) => {
    if (!selectedEmail) return;
    try {
      await updateReportRecipient({
        variables: {
          email: selectedEmail.email,
          weekly: emailData.weekly,
          monthly: emailData.monthly,
        },
      });
      refetch();
      setEditEmail(false);
      setSelectedEmail(null);
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
    } catch (err) {
      console.error("Error deleting report recipient:", err);
    }
  };

  const handleEditClick = (report: Report) => {
    setSelectedEmail(report);
    setEditEmail(true);
  };

  if (loading) {
    return (
      <Flex
        width="100%"
        height="fit-content"
        justifyContent="center"
        padding="20px"
      >
        <Text>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    // Log full error details to console for debugging
    console.error("Error loading reports:", error);
    console.error("Network error:", error.networkError);
    console.error("GraphQL errors:", error.graphQLErrors);

    // Extract more detailed error message
    let errorMessage = error.message;
    if (error.networkError) {
      errorMessage = error.networkError.message || error.message;
    } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors
        .map((err) => err.message)
        .join(", ");
    }

    return (
      <Flex
        width="100%"
        height="fit-content"
        justifyContent="center"
        padding="20px"
        flexDir="column"
        gap="10px"
      >
        <Text color="red" fontWeight="bold">
          Error loading reports
        </Text>
        <Text color="red">{errorMessage}</Text>
        <Text color="red" fontSize="sm">
          Check the browser console for more details.
        </Text>
      </Flex>
    );
  }

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
            Reports will be automatically generated and emailed. Edit frequency of reports below.
          </Text>
        </Flex>
      </Flex>
      <ReportsTable
        reports={reports}
        onAddEmail={() => setAddEmail(true)}
        onEditEmail={handleEditClick}
        onDeleteEmail={handleDeleteEmail}
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
