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
  IconButton,
  Icon,
} from "@chakra-ui/react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

type TableTypes = string | number | boolean | Date;

export type ColumnInfoTypes = { header: string; key: string };

interface TableData {
  [key: string]: TableTypes;
}

export type TableProps = {
  data: TableData[];
  columnInfo: ColumnInfoTypes[];
  onEdit: (row: unknown) => unknown;
  maxResults?: number;
  isSelectable?: boolean;
};

const CommonTable = ({
  columnInfo,
  data,
  onEdit,
  maxResults = 8,
  isSelectable = false,
}: TableProps): React.ReactElement => {
  const [checked, setChecked] = useState(data.map(() => false));
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
    <Box
      display="flex"
      flexDirection="column"
      alignContent="space-between"
      justifyContent="space-between"
      height="100%"
    >
      <TableContainer
        margin="10px"
        paddingTop="0px"
        border="2px solid"
        borderColor="gray.100"
        borderRadius="6px"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="gray.100" width="100%">
              {isSelectable ? (
                <Th padding="0px 0px 0px 20px" w="16px">
                  <Checkbox
                    borderColor="gray.300"
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
                return <Th key={index}>{header.header}</Th>;
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
                    {columnInfo.map((column, i) => (
                      <Td key={i}>{String(row[column.key])}</Td>
                    ))}
                    <Td onClick={() => onEdit(row)}>
                      <Icon
                        as={EditOutlinedIcon}
                        _hover={{ cursor: "pointer" }}
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
              }}
              color="purple.300"
              backgroundColor="white"
              aria-label="Previous Page"
              icon={<ChevronLeftOutlinedIcon />}
              onClick={() => leftPaginate()}
            />
            {pageArray.map((item, index) => {
              return (
                <Center
                  backgroundColor={item === page ? "purple.300" : "white"}
                  height="35px"
                  padding="10px"
                  flexBasis="35px"
                  borderRadius="7px"
                  _hover={{
                    cursor: "pointer",
                    color: "white",
                    backgroundColor: "purple.300",
                  }}
                  textColor={item === page ? "white" : "gray.500"}
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
              color="purple.300"
              backgroundColor="white"
              aria-label="Next Page"
              icon={<ChevronRightOutlinedIcon />}
              onClick={() => rightPaginate()}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CommonTable;
