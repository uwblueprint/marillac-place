import React, { useEffect, useState } from "react";
import { Flex, Tabs, TabList, Tab, Text } from "@chakra-ui/react";

import { tasksColumnTypes } from "./columnKeys";

import {
  scheduleTasksMockData,
  sundayScheduleTasksMockData,
  mondayScheduleTasksMockData,
  tuesdayScheduleTasksMockData,
  wednesdayScheduleTasksMockData,
  thursdayScheduleTasksMockData,
  fridayScheduleTasksMockData,
  saturdayScheduleTasksMockData,
} from "../../../mocks/scheduletasks";

import ScheduleTable, { ColumnInfoTypes, TableData } from "./ScheduleTable";

import RoomCard from "../home/HomeRoomCard";
import { residentsMockData } from "../../../mocks/residents";

const renderRoomCards = residentsMockData.map((resident) => (
  <RoomCard
    key={resident.residentId}
    room={resident.roomNumber}
    residentId={resident.residentId}
  />
));

const SchedulePage = (): React.ReactElement => {
  const enum Dates {
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
  }

  const [taskData, setTaskData] = useState<TableData[]>([]);
  const [storedTaskData, setStoredTaskData] = useState<TableData[]>([]);
  const [taskDataColumns, setTaskDataColumns] = useState<ColumnInfoTypes[]>([]);
  const [taskDate, setTaskDate] = useState(Dates.SUNDAY);
  const [dailyTaskData, setDailyTaskData] = useState<TableData[]>([]);

  useEffect(() => {
    setTaskDataColumns(tasksColumnTypes);
    setTaskData(scheduleTasksMockData);
    if (taskDate === Dates.SUNDAY) {
      setDailyTaskData(sundayScheduleTasksMockData);
    } else if (taskDate === Dates.MONDAY) {
      setDailyTaskData(mondayScheduleTasksMockData);
    } else if (taskDate === Dates.TUESDAY) {
      setDailyTaskData(tuesdayScheduleTasksMockData);
    } else if (taskDate === Dates.WEDNESDAY) {
      setDailyTaskData(wednesdayScheduleTasksMockData);
    } else if (taskDate === Dates.THURSDAY) {
      setDailyTaskData(thursdayScheduleTasksMockData);
    } else if (taskDate === Dates.FRIDAY) {
      setDailyTaskData(fridayScheduleTasksMockData);
    } else if (taskDate === Dates.SATURDAY) {
      setDailyTaskData(saturdayScheduleTasksMockData);
    } else {
      setDailyTaskData(sundayScheduleTasksMockData);
    }
  }, [taskDate]);

  return (
    <Flex flexDir="column" flexGrow={1} p="20px">
      <h1>Schedule Page</h1>
      <Flex flexWrap="wrap" justifyContent="flex-start">
        {renderRoomCards}
      </Flex>
      <Flex flexDir="column" flexGrow={1} p="20px">
        <Text as="b" display="block" margin="10px" textAlign="left">
          Weekly Tasks
        </Text>
        <ScheduleTable
          data={taskData}
          columnInfo={taskDataColumns}
          maxResults={8}
          onEdit={() => {}}
          isSelectable
        />
      </Flex>
      <Flex flexDir="column" flexGrow={1} p="20px">
        <Text as="b" display="block" margin="10px" textAlign="left">
          Daily Tasks
        </Text>
        <Tabs variant="enclosed-colored" h="30px" mb="10px" isFitted>
          <TabList margin="10px">
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.SUNDAY);
              }}
            >
              Sunday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.MONDAY);
              }}
            >
              Monday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.TUESDAY);
              }}
            >
              Tuesday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.WEDNESDAY);
              }}
            >
              Wednesday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.THURSDAY);
              }}
            >
              Thursday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.FRIDAY);
              }}
            >
              Friday
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "purple.main" }}
              borderRadius="8px 8px 0 0"
              onClick={() => {
                setTaskDate(Dates.SATURDAY);
              }}
            >
              Saturday
            </Tab>
          </TabList>
        </Tabs>
        <ScheduleTable
          data={dailyTaskData}
          columnInfo={taskDataColumns}
          maxResults={8}
          onEdit={() => {}}
          isSelectable
        />
      </Flex>
    </Flex>
  );
};

export default SchedulePage;
