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
  Spinner,
} from "@chakra-ui/react";
import { TableProps } from "../../../types";

const DataTable = ({
  loading,
  edit,
  selected,
  error,
  columns,
  rows,
  editModal,
}: TableProps) => {
  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        {edit && selected && editModal}
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
                    {col.sort}
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={6} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : error ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={6}>
                  <Text textStyle="web.b3" color="#000000" textAlign="center">
                    {error.message}
                  </Text>
                </Td>
              </Tr>
            ) : (
              rows.map((row, index) => (
                <Tr
                  key={index}
                  outline={index % 2 ? "0px solid" : "1px solid"}
                  outlineColor="neutral.300"
                >
                  {row.map((cell, cellIndex) => (
                    <Td key={cellIndex}>{cell}</Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DataTable;
