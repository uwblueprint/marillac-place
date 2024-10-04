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
  Center,
  Box,
  Flex,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

type TableTypes = string | number | boolean | Date;

export type ColumnInfoTypes = { header: string; key: string };

export interface TableData {
  [key: string]: TableTypes;
}

type Props = {
  data: TableData[];
  columnInfo: ColumnInfoTypes[];
  onEdit: (row: unknown) => unknown;
  maxResults?: number;
  isSelectable?: boolean;
};

type SortState = {
  [key: string]: number;
};

const ScheduleTable = ({
  columnInfo,
  data,
  onEdit,
  maxResults = 10,
  isSelectable = false,
}: Props): React.ReactElement => {
  const [checked, setChecked] = useState(data.map(() => false));
  const [page, setPage] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [sortingColumn, setSortingColumn] = useState<SortState>({});
  const [originalData, setOriginalData] = useState(data);
  const [sortedData, setSortedData] = useState(data);

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

  useEffect(() => {
    setOriginalData(data);
    setSortedData(data);
  }, [data]);

  // sorting the columns by ascending and descending order based on column indicated
  const sortColumn = (column: string) => {
    const newSortingColumn: SortState = {};
    columnInfo.forEach((col) => {
      newSortingColumn[col.key] =
        col.key === column ? sortingColumn[column] : 0;
    });

    // increment column sorting state
    sortingColumn[column] = sortingColumn[column]
      ? sortingColumn[column] + 1
      : 1;

    // if at the end, go back to 0
    if (sortingColumn[column] === 3) {
      setSortingColumn({ ...sortingColumn, [column]: 0 });
      setSortedData(originalData);
      return;
    }
    setSortingColumn({
      ...newSortingColumn,
      [column]: sortingColumn[column],
    });

    // apply sorting based on which sorting state the column's in
    const sorted = [...originalData].sort((a, b) => {
      if (sortingColumn[column] === 1) {
        return a[column] > b[column] ? 1 : -1;
      }
      if (sortingColumn[column] === 2) {
        return a[column] < b[column] ? 1 : -1;
      }
      return 0;
    });
    setSortedData(sorted);
  };

  // constants for pagination UI
  const checkedPage = checked.slice((page - 1) * maxResults, page * maxResults);
  const allChecked = checkedPage.every(Boolean);
  const isIndeterminate = checkedPage.some(Boolean) && !allChecked;

  // pagination functions
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
    <Flex
      flexDir="column"
      alignContent="space-between"
      justifyContent="space-between"
      h="100%"
    >
      <TableContainer
        m="10px"
        border="2px solid"
        borderColor="gray.200"
        borderRadius="6px"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="gray.200" w="100%">
              {isSelectable ? (
                <Th p="0px 0px 0px 20px" w="16px">
                  {null}
                </Th>
              ) : null}
              {columnInfo.map((header, index) => (
                <Th key={index}>
                  <Flex alignItems="center">
                    {header.header}
                    <Flex
                      alignItems="center"
                      flexDirection="column"
                      paddingLeft="2.5px"
                    >
                      <KeyboardArrowUpOutlinedIcon
                        style={{
                          height: "0.5em",
                          cursor: "pointer",
                          color:
                            sortingColumn[header.key] === 1 ? "" : "#c4c8d8",
                        }}
                        onClick={() => {
                          sortColumn(header.key);
                        }}
                      />
                      <KeyboardArrowDownOutlinedIcon
                        style={{
                          height: "0.5em",
                          cursor: "pointer",
                          color:
                            sortingColumn[header.key] === 2 ? "" : "#c4c8d8",
                        }}
                        onClick={() => {
                          sortColumn(header.key);
                        }}
                      />
                    </Flex>
                  </Flex>
                </Th>
              ))}
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {sortedData
              .slice((page - 1) * maxResults, page * maxResults)
              .map((row, index) => {
                return (
                  <Tr key={index}>
                    {isSelectable ? (
                      <Td p="0px 0px 0px 20px" w="16px">
                        <Checkbox
                          verticalAlign="middle"
                          m="0"
                          isChecked={checked[index + (page - 1) * maxResults]}
                          borderColor="black"
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
                      const getColor = (status: string) => {
                        if (status === "Completed") return "#0D8312";
                        if (status === "Excused") return "#B07D18";
                        if (status === "Incomplete") return "#B21D2F";
                        return "black";
                      };

                      const getBoxColor = (status: string) => {
                        if (status === "Completed") return "#CDEECE";
                        if (status === "Excused") return "#FFE5B2";
                        if (status === "Incomplete") return "#F8D7DB";
                        return "black";
                      };

                      return column.key === "status" ? (
                        <Td key={i} color={getColor(String(row[column.key]))}>
                          <Box
                            display="flex"
                            gap="4px"
                            height="40px"
                            width="200px"
                            justifyContent="space-evenly"
                            alignItems="center"
                            borderRadius="8px"
                            backgroundColor={getBoxColor(
                              String(row[column.key]),
                            )}
                          >
                            {row[column.key] ? (
                              <b>{String(row[column.key])}</b>
                            ) : (
                              ""
                            )}
                          </Box>
                        </Td>
                      ) : (
                        <Td key={i}>
                          {row[column.key] ? String(row[column.key]) : ""}
                        </Td>
                      );
                    })}
                    {row.status !== "Incomplete" && (
                      <Td onClick={() => onEdit(row)}>
                        <Icon
                          as={ModeCommentOutlinedIcon}
                          _hover={{ cursor: "pointer" }}
                        />
                      </Td>
                    )}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      <Box h="50px" position="relative">
        <Box position="absolute" w="250px" h="50px" ml="10px">
          {`Showing ${(page - 1) * maxResults + 1} to ${Math.min(
            page * maxResults,
            data.length,
          )} of ${data.length} entries`}
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
              }}
              color="purple.main"
              backgroundColor="white"
              aria-label="Previous Page"
              icon={<ChevronLeftOutlinedIcon />}
              onClick={() => leftPaginate()}
            />
            {pageArray.map((item, index) => {
              return (
                <Center
                  backgroundColor={item === page ? "purple.main" : "white"}
                  h="35px"
                  p="10px"
                  flexBasis="35px"
                  borderRadius="7px"
                  _hover={{
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "purple.main",
                  }}
                  textColor={item === page ? "white" : "gray.main"}
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
              }}
              color="purple.main"
              backgroundColor="white"
              aria-label="Next Page"
              icon={<ChevronRightOutlinedIcon />}
              onClick={() => rightPaginate()}
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default ScheduleTable;
