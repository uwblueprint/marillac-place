import React from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Switch,
  Button,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

type Report = {
  id: number;
  email: string;
  weekly: boolean;
  monthly: boolean;
  lastReportSent: string;
};

type ReportsTableProps = {
  reports: Report[];
  onAddEmail: () => void;
  onEditEmail: (email: Report) => void;
  onDeleteEmail: (id: number) => void;
  onToggleWeekly: (id: number, weekly: boolean) => void;
  onToggleMonthly: (id: number, monthly: boolean) => void;
};

export default function ReportsTable({
  reports,
  onAddEmail,
  onEditEmail,
  onDeleteEmail,
  onToggleWeekly,
  onToggleMonthly,
}: ReportsTableProps) {
  const columns = [
    { header: "Email", width: "30%" },
    { header: "Weekly", width: "15%" },
    { header: "Monthly", width: "15%" },
    { header: "Last Report Sent", width: "20%" },
    { header: "Actions", width: "20%" },
  ];

  const rows: JSX.Element[][] = reports.map((report: Report) => {
    const cells: JSX.Element[] = [
      <Text
        key={`email-${report.id}`}
        textStyle="web.b3"
        color="#000000"
        whiteSpace="normal"
      >
        {report.email}
      </Text>,
      <Flex
        key={`weekly-${report.id}`}
        alignItems="center"
        justifyContent="center"
      >
        <Switch
          isChecked={report.weekly}
          onChange={(e) => onToggleWeekly(report.id, e.target.checked)}
          colorScheme="blue"
        />
      </Flex>,
      <Flex
        key={`monthly-${report.id}`}
        alignItems="center"
        justifyContent="center"
      >
        <Switch
          isChecked={report.monthly}
          onChange={(e) => onToggleMonthly(report.id, e.target.checked)}
          colorScheme="blue"
        />
      </Flex>,
      <Text key={`lastReport-${report.id}`} textStyle="web.b3" color="#000000">
        {report.lastReportSent}
      </Text>,
      <Flex
        key={`actions-${report.id}`}
        alignItems="center"
        justifyContent="center"
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
        <Flex cursor="pointer" onClick={() => onDeleteEmail(report.id)}>
          <DeleteOutlineIcon
            style={{
              width: "1.3rem",
              height: "1.3rem",
              color: "#D34C5C",
            }}
          />
        </Flex>
      </Flex>,
    ];

    return cells;
  });

  // Add empty row for new entry
  const emptyRow: JSX.Element[] = [
    <Text
      key="empty-email"
      textStyle="web.b3"
      color="#999999"
      fontStyle="italic"
    >
      -
    </Text>,
    <Text
      key="empty-weekly"
      textStyle="web.b3"
      color="#999999"
      textAlign="center"
    >
      -
    </Text>,
    <Text
      key="empty-monthly"
      textStyle="web.b3"
      color="#999999"
      textAlign="center"
    >
      -
    </Text>,
    <Text key="empty-lastReport" textStyle="web.b3" color="#999999">
      -
    </Text>,
    <Text
      key="empty-actions"
      textStyle="web.b3"
      color="#999999"
      textAlign="center"
    >
      -
    </Text>,
  ];

  const allRows = [...rows, emptyRow];

  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              {columns.map((col) => (
                <Th width={col.width} key={col.header}>
                  <Flex alignItems="center" gap="8px">
                    <Text
                      textStyle="web.s1"
                      color="#000000"
                      textTransform="none"
                    >
                      {col.header}
                    </Text>
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {allRows.map((row, index) => (
              <Tr
                key={index}
                borderBottom="1px solid"
                borderColor="neutral.200"
                backgroundColor={index % 2 === 0 ? "white" : "gray.50"}
              >
                {row.map((cell, cellIndex) => (
                  <Td key={cellIndex} padding="12px 16px">
                    {cell}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justifyContent="flex-end" width="100%">
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
