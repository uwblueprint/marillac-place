import React, { ChangeEvent, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Image,
  Center,
  Box,
} from "@chakra-ui/react";
import pencil from "../../assets/pencil_edit.png";

export type TableTypes = "string" | "number" | "boolean" | "date";

export type ColumnInfoTypes = { Header: string; Type: TableTypes; Key: string };

export type TableProps = {
  data: any[];
  columnInfo: ColumnInfoTypes[];
  onEdit: (row: any) => any;
  maxResults: number;
  isSelectable: boolean;
};

// const onChangeAll = (type: ChangeEvent<HTMLInputElement>) => {
//   if (type.target.checked) {

//   } else {
//   }
// };

const CommonTable = ({
  columnInfo,
  data,
  isSelectable,
  maxResults,
  onEdit,
}: TableProps): React.ReactElement => {
  const checkRows: boolean[] = [];
  Object.keys(data).forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(data, item)) {
      checkRows.push(false);
    }
  });
  const [checked, setChecked] = useState(checkRows);
  const [page, setPage] = useState(1);

  const allChecked = checked.every(Boolean);
  const isIndeterminate = checked.some(Boolean) && !allChecked;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent="space-between">
      <TableContainer margin="10px"
      paddingTop="0px"
      border="2px solid lightgray"
      borderRadius="6px">
        <Table >
          <Thead> 
            <Tr
              backgroundColor="rgba(245, 246, 248, 1)"
              width="100%">
              {isSelectable ? (
                <Th 
                padding="0px 0px 0px 20px"
                w="16px">
                <Checkbox
                  verticalAlign="middle"
                  margin="0"
                  isChecked={allChecked}
                  isIndeterminate={isIndeterminate}
                  onChange={(e) => {
                    const newChecked = checked.map(() => e.target.checked);
                    setChecked(newChecked);
                  }}
                />
                </Th>
              ) : null}
              {columnInfo.map((header, index) => {
                return <Th key={index}>{header.Header}</Th>;
              })}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, index) => {
              return (
                <Tr key={index}>
                  {isSelectable ? (
                    <Td
                    padding="0px 0px 0px 20px"
                    w="16px">
                    <Checkbox
                      verticalAlign="middle"
                      margin="0"
                      isChecked={checked[index]}
                      onChange={(e) => {
                        const newChecked = [...checked];
                        newChecked[index] = e.target.checked;
                        setChecked(newChecked);
                      }}
                    />
                    </Td>
                    
                  ) : null}
                  {columnInfo.map((column, i) => {
                    return <Td key={i}>{row[column.Key as keyof typeof row]}</Td>;
                  })}
                  <Td onClick={() => onEdit(row)}>
                    <Image
                      boxSize="25px"
                      objectFit="cover"
                      _hover={{ cursor: "pointer" }}
                      src={pencil}
                      alt="edit"
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      
    <Box
    height="50px"
    border="2px solid black"
    display="flex"
    flexDirection="row">
        Pagination Row
    </Box>
    </Box>
  );
};

export default CommonTable;
