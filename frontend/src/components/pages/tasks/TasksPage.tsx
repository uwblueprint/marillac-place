import React, { useState } from "react";
import {
  Flex,
  Input,
  Stack,
  Button,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
// import { SearchIcon, AddIcon, DownloadIcon } from "@chakra-ui/icons";
// import CommonTable, { ColumnInfoTypes } from "../../common/CommonTable";

// Module not found: Error: Can't resolve '@mui/material/utils' in '/Users/kathleenxiong/Documents/GitHub/marillac-place/frontend/node_modules/@mui/icons-material/utils'
// ERROR in ./node_modules/@mui/icons-material/utils/createSvgIcon.js 13:13-43
// Module not found: Error: Can't resolve '@mui/material/utils' in '/Users/kathleenxiong/Documents/GitHub/marillac-place/frontend/node_modules/@mui/icons-material/utils'

import SideBar from "../../common/SideBar";

// import { data } from "./temp";

// const columnTypes: ColumnInfoTypes[] = [
//   {
//     Header: "Task Name",
//     Type: "string",
//     Key: "room",
//   },
//   {
//     Header: "Due Date",
//     Type: "string",
//     Key: "due_date",
//   },
//   {
//     Header: "Marillac Bucks",
//     Type: "number",
//     Key: "marillac_bucks",
//   }
// ];

// type TaskTab = "Required" | "Optional" | "Custom" | "Chore";

const TasksPage = (): React.ReactElement => {
  const [dataType, setDataType] = useState("Required");
  return (
    <Flex>
      <SideBar>
        <></>
      </SideBar>

      <Flex display="flex" flexDirection="column" width="100%">
        <Flex>
          <Tabs variant="horizontal" width="100%">
            <TabList>
              <Tab onClick={() => setDataType("Required")}>Required</Tab>
              <Tab onClick={() => setDataType("Optional")}>Optional</Tab>
              <Tab onClick={() => setDataType("Custom")}>Custom</Tab>
              <Tab onClick={() => setDataType("Chores")}>Chores</Tab>
            </TabList>
          </Tabs>
        </Flex>

        {/* Add theme values to these elements when merged in: */}
        <Flex flexDirection="column" flexGrow={1} padding="20px">
          <Flex
            justifyContent="space-between"
            padding="10px"
            paddingBottom="10px"
          >
            <InputGroup width="30%">
              <InputLeftElement pointerEvents="none">
                <SearchIcon style={{ color: "grey" }} />
              </InputLeftElement>
              <Input placeholder="Search" />
            </InputGroup>

            <Stack direction="row" spacing={4}>
              <Button
                leftIcon={<FileDownloadOutlinedIcon />}
                colorScheme="purple"
                bg="#F1ECFF"
                variant="outline"
                size="sm"
                onClick={() => {
                  alert("DOWNLOAD CSV");
                }}
              >
                Export
              </Button>
              <Button
                leftIcon={<AddIcon />}
                bg="purple"
                color="white"
                size="sm"
                onClick={() => {
                  alert("ADD TASK");
                }}
              >
                Add Task
              </Button>
            </Stack>
          </Flex>

          {dataType}
          {/* <CommonTable
                    data={data}
                    columnInfo={columnTypes}
                    maxResults={4}
                    onEdit={() => {
                        alert("EDITING");
                    }}
                    isSelectable={false}
                    /> */}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TasksPage;
