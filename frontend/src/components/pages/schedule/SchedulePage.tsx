import React, { useEffect, useState } from "react";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
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

import { ScheduleType } from "../../../types/ScheduleTypes";
import ScheduleListView from "./listView/ScheduleListView";
import { ScheduleCalendar } from "./calendarView/ScheduleCalendar";

const SchedulePage = (): React.ReactElement => {
  const [rooms, setRooms] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("LIST");
  const [scheduleData, setScheduleData] = useState<string>("");
  const [active, setActive] = useState<string>("List");

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

  const selectOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(e.currentTarget.innerText);
  };

  const formatTabs = (roomNums: number[]) => {
    return (
      <Tabs variant="horizontal" h="30px" mb={6}>
        <TabList pl={6}>
          {roomNums.map((room) => (
            <Tab key={room} width="10%">
              Room {room}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  };

  return (
    <Flex flexDir="column" flexGrow={1}>
      <Tabs variant="horizontal" h="30px" mb={6}>
        {formatTabs(rooms)}
      </Tabs>

      <Flex justifyContent="space-between" mt={10} ml={8} mr={10}>
        <Flex>
          <Button
            variant={active === "List" ? "primary" : "secondary"}
            w="7vw"
            borderRightRadius="0"
            leftIcon={<Icon as={FormatListBulleted} color="white" />}
            size="sm"
            onClick={(event) => {
              selectOption(event);
              setScheduleType("LIST");
            }}
          >
            List
          </Button>

          <Button
            variant={active === "Calendar" ? "primary" : "secondary"}
            w="7vw"
            borderLeftRadius="0"
            leftIcon={<Icon as={CalendarMonth} color="white" />}
            size="sm"
            onClick={(event) => {
              selectOption(event);
              setScheduleType("CALENDAR");
            }}
          >
            Calendar
          </Button>
        </Flex>
        <Flex flexDir="row" height="100px" justifyContent="space-between">
          <Button
            variant="success"
            rightIcon={<Icon as={Edit} color="green.main" />}
            size="sm"
            onClick={() => {}}
            mr={5}
          >
            200 M-Bucks
          </Button>
          <Button variant="primary" size="sm" onClick={() => {}}>
            Update Selected
          </Button>
        </Flex>
      </Flex>

      {scheduleType === "CALENDAR" ? (
        <ScheduleCalendar />
      ) : (
        <ScheduleListView />
      )}
    </Flex>
  );
};

export default SchedulePage;
