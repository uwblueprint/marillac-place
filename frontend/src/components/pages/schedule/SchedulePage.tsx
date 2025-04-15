import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  Box,
  Heading,
  Button,
  IconButton,
  Icon,
} from "@chakra-ui/react";

import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Edit,
  FormatListBulleted,
  CalendarMonth,
} from "@mui/icons-material";

import FullCalendar from "@fullcalendar/react";
import { CalendarApi } from "@fullcalendar/core";
import { ScheduleType } from "../../../types/ScheduleTypes";
import ScheduleListView from "./listView/ScheduleListView";
import ScheduleCalendar from "./calendarView/ScheduleCalendar";
import SideBar from "../../common/SideBar";
import AddTaskCard from "./AddTaskCard";
import AddMarillacBucks from "./AddMarillacBucks";

const SchedulePage = (): React.ReactElement => {
  const [addTaskCardOpened, setAddTaskCardOpened] = useState(false);
  const [rooms, setRooms] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("LIST");
  const [scheduleData, setScheduleData] = useState<string>("");
  const [active, setActive] = useState<string>("List");
  const [dateRange, setDateRange] = useState("Jan 1 - 7");
  const [addBucksCardOpened, setAddBucksCardOpened] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(1);
  const calendarRef = useRef<CalendarApi | null>(null);
  const [credit, setCredit] = useState(0);

  const handleNext = () => {
    console.log(scheduleType);
    if (scheduleType === "CALENDAR") {
      calendarRef.current?.next();
    }
  };
  useEffect(() => {
    console.log(currentRoom);
  }, [currentRoom]);
  const handlePrev = () => {
    if (scheduleType === "CALENDAR") {
      calendarRef.current?.prev();
    }
  };

  useEffect(() => {
    // TODO: Fetch occupied rooms from API?
    setRooms([1, 2, 3, 4, 5, 6]);
  }, []);

  useEffect(() => {
    if (scheduleType === "LIST") {
      setScheduleData("List");
    } else if (scheduleType === "CALENDAR") {
      setScheduleData("Calendar");
    }
  }, [scheduleType]);
  useEffect(() => {
    console.log("CREDIT UPDATED IN PARENT:", credit);
  }, [credit]);

  const selectOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(e.currentTarget.innerText);
    console.log(e.currentTarget.innerText, "hello ");
  };

  const formatTabs = (roomNums: number[]) => {
    return (
      <Tabs variant="horizontal" h="30px" mb={6}>
        <TabList pl={6}>
          {roomNums.map((room) => (
            <Tab key={room} onClick={() => setCurrentRoom(room)} width="10%">
              Room {room}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  };

  return (
    <Flex>
      <SideBar />
      <Flex flexDir="column" flexGrow={1}>
        <Tabs variant="horizontal" h="30px" mb={6}>
          {formatTabs(rooms)}
        </Tabs>

        <Flex justifyContent="space-between" mt={10} ml={8} mr={5}>
          <Flex>
            <Heading
              size="lg"
              fontSize="36px"
              color="teal.main"
              whiteSpace="nowrap"
            >
              January 2025
              {/* see announcements page for how to determine what text shows */}
            </Heading>

            <Flex w="200px" flexDir="row" height="100px" ml={5}>
              <IconButton
                onClick={handlePrev}
                _hover={{
                  cursor: "pointer",
                }}
                color="teal.main"
                backgroundColor="grey.50"
                borderRightRadius="0"
                aria-label="Previous Week"
                icon={<ArrowBackIosNew fontSize="small" />}
              />
              <Button
                alignContent="center"
                borderRadius="0"
                color="teal.main"
                size="md"
                fontSize="lg"
              >
                {dateRange}
              </Button>
              <IconButton
                onClick={handleNext}
                _hover={{
                  cursor: "pointer",
                }}
                color="teal.main"
                backgroundColor="grey.50"
                borderLeftRadius="0"
                aria-label="Previous Week"
                icon={<ArrowForwardIos fontSize="small" />}
              />
            </Flex>
          </Flex>

          <Flex flexDir="row" height="100px" justifyContent="space-between">
            <Button
              variant="success"
              rightIcon={<Icon as={Edit} color="green.main" />}
              size="sm"
              onClick={() => setAddBucksCardOpened(true)}
              mr={5}
            >
              {credit} M-Bucks
            </Button>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mt={-5} ml={8} mr={10}>
          <Flex>
            <AddTaskCard
              isOpen={addTaskCardOpened}
              setIsOpen={setAddTaskCardOpened}
            />
            <Button
              variant={active === "List" ? "primary" : "primaryInactive"}
              w="8em"
              borderRightRadius="0"
              leftIcon={
                <Icon
                  as={FormatListBulleted}
                  color={active === "List" ? "white" : "orange.main"}
                />
              }
              size="sm"
              onClick={(event) => {
                selectOption(event);
                setScheduleType("LIST");
              }}
            >
              List
            </Button>

            <Button
              variant={active === "Calendar" ? "primary" : "primaryInactive"}
              w="8em"
              borderLeftRadius="0"
              leftIcon={
                <Icon
                  as={CalendarMonth}
                  color={active === "Calendar" ? "white" : "orange.main"}
                />
              }
              size="sm"
              onClick={(event) => {
                selectOption(event);
                setScheduleType("CALENDAR");
              }}
            >
              Calendar
            </Button>
          </Flex>
          <Flex justifyContent="end" gap="3" alignItems="end">
            <Button variant="primary" size="sm" onClick={() => {}}>
              Update Selected
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddTaskCardOpened(true)}
            >
              + Assign Task
            </Button>
          </Flex>
        </Flex>
        <Box padding="40px">
          {scheduleType === "CALENDAR" ? (
            <ScheduleCalendar
              ref={calendarRef}
              setDateRange={(range: string) => setDateRange(range)}
            />
          ) : (
            <ScheduleListView />
          )}
        </Box>
      </Flex>
      <AddMarillacBucks
        currentRoom={currentRoom}
        credit={credit}
        setCredit={setCredit}
        isOpen={addBucksCardOpened}
        setIsOpen={setAddBucksCardOpened}
      />
    </Flex>
  );
};

export default SchedulePage;
