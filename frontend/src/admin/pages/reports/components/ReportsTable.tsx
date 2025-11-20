import React from "react";
import { Text, Flex, Button } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

import DataTable from "../../../../ui/misc/DataTable";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

type ReportsTableProps = {
  reports: Report[];
  onAddEmail: () => void;
  onEditEmail: (email: Report) => void;
  onDeleteEmail: (email: string) => void;
};

export default function ReportsTable({
  reports,
  onAddEmail,
  onEditEmail,
  onDeleteEmail,
}: ReportsTableProps) {
  const columns = [
    { header: "Email", width: "30%" },
    { header: "Weekly", width: "15%" },
    { header: "Monthly", width: "15%" },
    { header: "Actions", width: "20%" },
  ];

  const rows = reports.map((report: Report) => [
    {
      element: (
        <Text
          textStyle="web.b3"
          color="#000000"
          whiteSpace="normal"
        >
          {report.email}
        </Text>
      ),
    },
    {
      element: (
        <Text textStyle="web.b3" color={report.weekly ? "green" : "gray"} fontWeight="bold">
          {report.weekly ? "Yes" : "No"}
        </Text>
      ),
    },
    {
      element: (
        <Text textStyle="web.b3" color={report.monthly ? "green" : "gray"} fontWeight="bold">
          {report.monthly ? "Yes" : "No"}
        </Text>
      ),
    },
    {
      element: (
        <Flex
          alignItems="center"
          gap="8px"
        >
          <Flex
            cursor="pointer"
            onClick={() => onEditEmail(report)}
            padding="4px"
            borderRadius="4px"
            _hover={{ backgroundColor: "gray.100" }}
          >
            <EditIcon
              style={{
                width: "1.2rem",
                height: "1.2rem",
                color: "#666666",
              }}
            />
          </Flex>
          <Flex
            cursor="pointer"
            onClick={() => onDeleteEmail(report.email)}
            padding="4px"
            borderRadius="4px"
            _hover={{ backgroundColor: "gray.100" }}
          >
            <DeleteOutlineIcon
              style={{
                width: "1.3rem",
                height: "1.3rem",
                color: "#D34C5C",
              }}
            />
          </Flex>
        </Flex>
      ),
    },
  ]);

  return (
    <>
      <DataTable
        loading={false} // You can pass loading state from Main.tsx if needed
        columns={columns}
        rows={reports.length === 0 ? [] : rows}
      />

      {reports.length === 0 && (
        <Flex justifyContent="center" padding="20px">
          <Text textStyle="web.b3" color="#999999" fontStyle="italic">
            No report recipients added yet
          </Text>
        </Flex>
      )}

      <Flex justifyContent="flex-end" width="100%" mt="15px">
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          variant="solid"
          onClick={onAddEmail}
          size="sm"
        >
          Add Email
        </Button>
      </Flex>
    </>
  );
}
