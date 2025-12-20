import React, { ReactNode } from "react";
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
  Spinner,
  Button,
} from "@chakra-ui/react";

export type Column = {
  header: string;
  width: string;
};

export type Row = {
  element: string | ReactNode;
  action?: () => void;
};

type DataTableProps = {
  loading: boolean;
  error?: string;
  columns: Column[];
  rows: Row[][];
};

const DataTable = ({ loading, error, columns, rows }: DataTableProps) => {
  return (
    <TableContainer
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      w="100%"
    >
      <Table>
        <Thead>
          <Tr backgroundColor="neutral.200" w="100%">
            {columns.map((col: Column, index: number) => (
              <Th width={col.width} key={index}>
                <Text
                  textStyle="web.s1"
                  color="#000000"
                  textTransform="none"
                  textAlign="left"
                >
                  {col.header}
                </Text>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr outline="1px solid" outlineColor="neutral.300">
              <Td colSpan={6} textAlign="center" paddingY="50px">
                <Spinner size="md" color="primary.700" />
              </Td>
            </Tr>
          ) : error ? (
            <Tr outline="1px solid" outlineColor="neutral.300">
              <Td colSpan={6} paddingY="50px">
                <Flex flexDir="column" gap="2px">
                  <Text textStyle="web.b2" color="#E30000" textAlign="center">
                    ERROR
                  </Text>
                  <Text
                    textStyle="web.b2"
                    color="text.light.secondary"
                    textAlign="center"
                  >
                    {error}
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ) : (
            rows.map((row: Row[], index: number) => (
              <Tr
                key={index}
                outline={index % 2 ? "0px solid" : "1px solid"}
                outlineColor="neutral.300"
              >
                {row.map((cell: Row, cellIndex: number) => (
                  <Td key={cellIndex}>
                    {cell.action ? (
                      <Flex
                        w="100%"
                        h="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          onClick={cell.action}
                          cursor="pointer"
                          backgroundColor="transparent"
                          border="none"
                          height="fit-content"
                          lineHeight={1}
                          _hover={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          {cell.element}
                        </Button>
                      </Flex>
                    ) : (
                      <Text
                        textStyle="web.b3"
                        color="text.light.primary"
                        textAlign="left"
                      >
                        {cell.element}
                      </Text>
                    )}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
