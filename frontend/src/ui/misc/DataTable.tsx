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
  center?: boolean;
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
      borderColor="background.border"
      borderRadius="8px"
      w="100%"
    >
      <Table>
        <Thead>
          <Tr backgroundColor="background.highlight" w="100%">
            {columns.map((col: Column, index: number) => (
              <Th width={col.width} key={index}>
                <Text
                  textStyle="s2"
                  color="text.dark"
                  textTransform="none"
                  textAlign={col.center ? "center" : "left"}
                >
                  {col.header}
                </Text>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr outline="1px solid" outlineColor="background.border">
              <Td colSpan={6} textAlign="center" paddingY="50px">
                <Spinner size="md" color="brand.primaryDark" />
              </Td>
            </Tr>
          ) : error ? (
            <Tr outline="1px solid" outlineColor="background.border">
              <Td colSpan={6} paddingY="50px">
                <Flex flexDir="column" gap="2px">
                  <Text textStyle="s1" color="indicate.brightRed" textAlign="center">
                    ERROR
                  </Text>
                  <Text
                    textStyle="b1"
                    color="text.medium"
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
                outlineColor="background.border"
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
                          margin="0px"
                          padding="0px"
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
                        textStyle="b2"
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
