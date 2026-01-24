import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import ReportsTable from "./components/ReportsTable";
import AddEmailModal from "./components/AddEmailModal";
import { GET_REPORT_RECIPIENTS } from "../../../gql/reportRecipientRequests";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import OrangeButton from "../../../ui/buttons/OrangeButton";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

// TODO: Relief staff cannot access this page
export default function AdminReportsPage() {
  const { loading, error, data, refetch } = useQuery(GET_REPORT_RECIPIENTS);
  const reports: Report[] = data?.getReportRecipients || [];

  const [addEmail, setAddEmail] = useState(false);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error.message} />;

  return (
    <Flex width="100%" height="fit-content" flexDir="column" gap="15px">
      <Flex
        width="100%"
        height="fit-content"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" justifyContent="space-between" w="100%">
          <Flex alignItems="baseline" gap="15px">
            <Text textStyle="h2" color="brand.primaryDark" pl="5px">
              Reports
            </Text>
            <Text
              textStyle="b2"
              color="text.light"
            >
              Reports will be automatically generated and emailed. Edit
              frequency of reports below.
            </Text>
          </Flex>
          <OrangeButton
            label="Add Email"
            action={() => setAddEmail(true)}
            is_active={addEmail}
          />
        </Flex>
      </Flex>
      <ReportsTable reports={reports} refetch={refetch} />

      {addEmail && (
        <AddEmailModal onClose={() => setAddEmail(false)} refetch={refetch} />
      )}
    </Flex>
  );
}
