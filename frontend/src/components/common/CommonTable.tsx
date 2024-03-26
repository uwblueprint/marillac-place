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
  Checkbox,
  Image,
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
  onEdit,
}: TableProps): React.ReactElement => {
  const checkRows: boolean[] = [];
  Object.keys(data).forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(data, item)) {
      checkRows.push(false);
    }
  });
  const [checked, setChecked] = useState(checkRows);

  const allChecked = checked.every(Boolean);
  const isIndeterminate = checked.some(Boolean) && !allChecked;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {isSelectable ? (
              <Checkbox
                isChecked={allChecked}
                isIndeterminate={isIndeterminate}
                onChange={(e) => {
                  const newChecked = checked.map(() => e.target.checked);
                  setChecked(newChecked);
                }}
              />
            ) : null}
            {columnInfo.map((header, index) => {
              return <Th key={index}>{header.Header}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => {
            return (
              <Tr key={index}>
                {isSelectable ? (
                  <Checkbox
                    isChecked={checked[index]}
                    onChange={(e) => {
                      const newChecked = [...checked];
                      newChecked[index] = e.target.checked;
                      setChecked(newChecked);
                    }}
                  />
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
  );
};

export default CommonTable;
