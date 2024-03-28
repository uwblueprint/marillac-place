import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import pencil from "../../assets/pencil_edit.png";

export type TableTypes = "string" | "number" | "boolean" | "date";

export type ColumnInfoTypes = { Header: string; Type: TableTypes; Key: string };

export type TableProps = {
  // eslint-disable-next-line
  data: any[];
  columnInfo: ColumnInfoTypes[];
  // eslint-disable-next-line
  onEdit: (row: any) => any;
  maxResults: number;
  isSelectable: boolean;
};

export const mockData = [
  {
    id: 1,
    title: "taxes",
    description: "do ur taxes",
    room: 1,
    credits: "$4.00",
    due_date: "2022-12-12",
  },
  {
    id: 2,
    title: "more taxes",
    description: "do ur taxes",
    room: 1,
    credits: "$3.00",
    due_date: "2022-12-12",
  },
  {
    id: 3,
    title: "heap of taxes",
    description: "do ur taxes",
    room: 2,
    credits: "$2.00",
    due_date: "2022-12-12",
  },
  {
    id: 4,
    title: "im too lazy",
    description: "do ur taxes",
    room: 2,
    credits: "$4.00",
    due_date: "2022-12-12",
  },
  {
    id: 5,
    title: "t5",
    description: "do ur taxes",
    room: 3,
    credits: "$3.00",
    due_date: "2022-12-12",
  },
  {
    id: 6,
    title: "t6",
    description: "do ur taxes",
    room: 3,
    credits: "$2.00",
    due_date: "2022-12-12",
  },
  {
    id: 7,
    title: "t7",
    description: "do ur taxes",
    room: 4,
    credits: "$3.00",
    due_date: "2022-12-12",
  },
  {
    id: 8,
    title: "t8",
    description: "do ur taxes",
    room: 4,
    credits: "$2.00",
    due_date: "2022-12-12",
  },
  {
    id: 9,
    title: "t9",
    description: "do ur taxes",
    room: 5,
    credits: "$3.00",
    due_date: "2022-12-12",
  },
  {
    id: 10,
    title: "t10",
    description: "do ur taxes",
    room: 5,
    credits: "$2.00",
    due_date: "2022-12-12",
  },
  {
    id: 11,
    title: "t11",
    description: "do ur taxes",
    room: 6,
    credits: "$3.00",
    due_date: "2022-12-12",
  },
  {
    id: 12,
    title: "t12",
    description: "do ur taxes",
    room: 6,
    credits: "$2.00",
    due_date: "2022-12-12",
  },
];

export const mockColumns: ColumnInfoTypes[] = [
  {
    Header: "Task name",
    Type: "string",
    Key: "title",
  },
  {
    Header: "Room Number",
    Type: "number",
    Key: "room",
  },
  {
    Header: "Due Date",
    Type: "date",
    Key: "due_date",
  },
  {
    Header: "Requested Marillac Bucks",
    Type: "number",
    Key: "credits",
  },
];

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
  const [pageArray, setPageArray] = useState<number[]>([]);

  useEffect(() => {
    return Math.ceil(data.length / maxResults) >= 5
      ? setPageArray([1, 2, 3, 4, 5])
      : setPageArray(
          Array.from(
            { length: Math.ceil(data.length / maxResults) },
            (_, i) => i,
          ),
        );
  }, [data, maxResults]);

  const checkedPage = checked.slice((page - 1) * maxResults, page * maxResults);
  const allChecked = checkedPage.every(Boolean);
  const isIndeterminate = checkedPage.some(Boolean) && !allChecked;

  const leftPaginate = () => {
    if (page > 1) setPage(page - 1);
    if (pageArray[0] > 1 && pageArray.length === 5) {
      setPageArray(pageArray.map((item) => item - 1));
    }
  };

  const rightPaginate = () => {
    if (page < Math.ceil(data.length / maxResults)) setPage(page + 1);
    if (
      pageArray[pageArray.length - 1] < Math.ceil(data.length / maxResults) &&
      pageArray.length === 5
    ) {
      setPageArray(pageArray.map((item) => item + 1));
    }
  };

  const numberPaginate = (n: number) => {
    setPage(n);
    // Sets n as the center of the page array when possible.
    if (
      n - 2 >= 1 &&
      n + 2 <= Math.ceil(data.length / maxResults) &&
      pageArray.length === 5
    ) {
      setPageArray([n - 2, n - 1, n, n + 1, n + 2]);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignContent="space-between">
      <TableContainer
        margin="10px"
        paddingTop="0px"
        border="2px solid lightgray"
        borderRadius="6px"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="rgba(245, 246, 248, 1)" width="100%">
              {isSelectable ? (
                <Th padding="0px 0px 0px 20px" w="16px">
                  <Checkbox
                    verticalAlign="middle"
                    margin="0"
                    isChecked={allChecked}
                    isIndeterminate={isIndeterminate}
                    onChange={(e) => {
                      const newChecked = [...checked];
                      for (
                        let i = (page - 1) * maxResults;
                        i < page * maxResults;
                        i += 1
                      ) {
                        newChecked[i] = e.target.checked;
                      }
                      setChecked(newChecked);
                    }}
                  />
                </Th>
              ) : null}
              {columnInfo.map((header, index) => {
                return <Th key={index}>{header.Header}</Th>;
              })}
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {data
              .slice((page - 1) * maxResults, page * maxResults)
              .map((row, index) => {
                return (
                  <Tr key={index}>
                    {isSelectable ? (
                      <Td padding="0px 0px 0px 20px" w="16px">
                        <Checkbox
                          verticalAlign="middle"
                          margin="0"
                          isChecked={checked[index + (page - 1) * maxResults]}
                          onChange={(e) => {
                            const newChecked = [...checked];
                            newChecked[index + (page - 1) * maxResults] =
                              e.target.checked;
                            setChecked(newChecked);
                          }}
                        />
                      </Td>
                    ) : null}
                    {columnInfo.map((column, i) => {
                      return (
                        <Td key={i}>{row[column.Key as keyof typeof row]}</Td>
                      );
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

      <Box height="50px" position="relative">
        <Box position="absolute" width="250px" height="50px" marginLeft="10px">
          {`Showing ${(page - 1) * maxResults + 1} to ${page * maxResults} of ${
            data.length
          } entries`}
        </Box>
        <Box position="absolute" left="50%" transform="translateX(-50%)">
          <Box
            display="flex"
            gap="4px"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <IconButton
              role="group"
              boxSize="35px"
              _hover={{
                cursor: "pointer",
                backgroundColor: "rgba(87, 70, 157, 1)",
              }}
              onClick={() => leftPaginate()}
              aria-label="Previous Page"
              icon={
                <ChevronLeftIcon
                  boxSize="25px"
                  color="rgba(87, 70, 157, 1)"
                  _groupHover={{ color: "white" }}
                />
              }
            />
            {pageArray.map((item, index) => {
              return (
                <Center
                  backgroundColor={
                    item === page ? "rgba(87, 70, 157, 1)" : "white"
                  }
                  height="35px"
                  padding="10px"
                  flexBasis="35px"
                  borderRadius="7px"
                  _hover={{
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "rgba(87, 70, 157, 1)",
                  }}
                  textColor={item === page ? "white" : "rgba(128, 128, 128, 1)"}
                  onClick={() => numberPaginate(item)}
                  key={index}
                >
                  {item}
                </Center>
              );
            })}
            <IconButton
              role="group"
              boxSize="35px"
              _hover={{
                cursor: "pointer",
                backgroundColor: "rgba(87, 70, 157, 1)",
              }}
              onClick={() => rightPaginate()}
              aria-label="Previous Page"
              icon={
                <ChevronRightIcon
                  boxSize="25px"
                  color="rgba(87, 70, 157, 1)"
                  _groupHover={{ color: "white" }}
                />
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommonTable;
