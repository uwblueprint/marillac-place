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
  Flex,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon, EditIcon } from "@chakra-ui/icons";

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
          (_, i) => i + 1,
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
    <Flex flexBasis="100%" flexDirection="column" justifyContent="space-between" width="100%">
      <TableContainer
        margin="10px"
        paddingTop="0px"
        border="2px solid lightgray"
        borderRadius="6px"
        maxWidth="100%"
      >
        <Table maxWidth="100%">
          <Thead>
            <Tr backgroundColor="rgba(245, 246, 248, 1)" width="100%">
              {isSelectable ? (
                <Th padding="0px 0px 0px 10px" w="16px">
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
                      <Td padding="0px 0px 0px 10px" w="16px">
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
                        <Td key={i} fontSize='sm'>{row[column.Key as keyof typeof row]}</Td>
                      );
                    })}
                    <Td paddingRight="0px" onClick={() => onEdit(row)}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17V14.575C0 14.3083 0.05 14.0542 0.15 13.8125C0.25 13.5708 0.391667 13.3583 0.575 13.175L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.825 17.425C4.64167 17.6083 4.42917 17.75 4.1875 17.85C3.94583 17.95 3.69167 18 3.425 18H1ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z" fill="black"/>
                      </svg>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex height="50px" position="relative">
        <Box position="absolute" width="250px" height="50px" marginLeft="10px">
          {`Showing ${(page - 1) * maxResults + 1} to ${page * maxResults} of ${data.length
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
              backgroundColor="white"
              paddingRight="5px"
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
              backgroundColor="white"
              paddingLeft="5px"
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
      </Flex>
    </Flex>
  );
};

export default CommonTable;
