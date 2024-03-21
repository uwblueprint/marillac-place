import React, { ChangeEvent, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Checkbox
} from '@chakra-ui/react'


export type tableTypes = "string" | "number" | "boolean" | "date";

export type columnInfoType = { Header: string, Type: tableTypes, Key: string }

export type tableProps = {
  data: any[];
  columnInfo: columnInfoType[];
  onEdit: (row: any) => any;
  maxResults: number;
  isSelectable: boolean;
}

const onChangeAll = (type: ChangeEvent<HTMLInputElement>) => {
  if (type.target.checked) {
    
  } else {

  }
}

const CommonTable = (props: tableProps): React.ReactElement => {

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
          (isSelectable ? <Checkbox></Checkbox> : null)
          {props.columnInfo.map((header, index) => {
            return (
              <Th key={index}>{header.Header}</Th>
            )
          })}
          </Tr>
        </Thead>
        <Tbody>
          {props.data.map((row, index) => {
            return (
              <Tr key={index}>
                {props.columnInfo.map((column, index) => {
                  return (
                    <Td key={index}>{row[column.Key as keyof typeof row]}</Td>
                  )
                })}
                <Td onClick={() => props.onEdit(row)}>EDIT</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
