import React from "react";
import { Text, Flex, Button, IconButton, HStack } from "@chakra-ui/react";
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
        <Text textStyle="web.b3" color="text.light.primary" whiteSpace="normal">
          {report.email}
        </Text>
      ),
    },
    {
      element: (
        <Text
          textStyle="web.b3"
          color={report.weekly ? "success.900" : "text.light.secondary"}
          fontWeight="bold"
        >
          {report.weekly ? "Yes" : "No"}
        </Text>
      ),
    },
    {
      element: (
        <Text
          textStyle="web.b3"
          color={report.monthly ? "success.900" : "text.light.secondary"}
          fontWeight="bold"
        >
          {report.monthly ? "Yes" : "No"}
        </Text>
      ),
    },
    {
      element: (
        <HStack spacing="8px">
          <IconButton
            aria-label="Edit email"
            icon={<EditIcon sx={{ fontSize: "1.2rem" }} />}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            onClick={() => onEditEmail(report)}
            color="text.light.secondary"
            _hover={{
              backgroundColor: "neutral.200",
            }}
          />
          <IconButton
            aria-label="Delete email"
            icon={<DeleteOutlineIcon sx={{ fontSize: "1.3rem" }} />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => onDeleteEmail(report.email)}
            color="danger.800"
            _hover={{
              backgroundColor: "danger.100",
            }}
          />
        </HStack>
      ),
    },
  ]);

  return (
    <>
      <DataTable
        loading={false} // pass loading state from Main.tsx if needed
        columns={columns}
        rows={reports.length === 0 ? [] : rows}
      />

      {reports.length === 0 && (
        <Flex justifyContent="center" padding="20px">
          <Text
            textStyle="web.b3"
            color="text.light.disabled"
            fontStyle="italic"
          >
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
