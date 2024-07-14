import React, { useEffect, useState } from "react";
import { 
  Flex,
  Tabs,
  TabList,
  Tab,
  Heading,
  Box,
  Text,
  Button,
  IconButton,
  Icon
 } from "@chakra-ui/react";

import { 
  ArrowBackIosNew,
  ArrowForwardIos,
  Edit,
  Add,
  FormatListBulleted,
  CalendarMonth
} from '@mui/icons-material';

import SideBar from "../../common/SideBar";

import {
  ScheduleType,
} from "../../../types/ScheduleTypes";

const SchedulePage = (): React.ReactElement => {
  const [rooms, setRooms] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("LIST");
  const [scheduleData, setScheduleData] = useState<string>("");
  const [active, setActive] = useState<string>("List");

  useEffect(() => {
    // TODO: Fetch occupied rooms from API?
    setRooms([1,2,3,4,5,6]);
  }, []);

  useEffect(() => {
    if (scheduleType === "LIST") {
      setScheduleData("List");
    } else if (scheduleType === "CALENDAR") {
      setScheduleData("Calendar");
    }
  }, [scheduleType]);

  const selectOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(e.currentTarget.innerText)
  };

  const formatTabs = (roomNums: number[]) => {
    return <Tabs variant="horizontal" h="30px" mb={6}>
      <TabList pl={6}>
        { roomNums.map(room => (
            <Tab key={room} width="10%">
              Room {room}
            </Tab>))
        }
      </TabList>
    </Tabs>
  }

  return (
    <Flex>
      <SideBar />
      <Flex flexDir="column" flexGrow={1}>

        <Tabs variant="horizontal" h="30px" mb={6}>
          {formatTabs(rooms)}
        </Tabs>

        <Flex justifyContent="space-between" mt={10} ml={8} mr={10}>
          <Flex>
            <Heading size="lg" fontSize="36px" w="14vw" color="purple.main">
              January 2025 
              {/* see announcements page for how to determine what text shows */}
            </Heading>

            <Flex w='200px' flexDir="row" height='100px' ml={5}>
              <IconButton 
                _hover={{
                  cursor: "pointer",
                }}
                color="purple.main"
                backgroundColor="grey.50"
                borderRightRadius='0'
                aria-label="Previous Week"
                icon={<ArrowBackIosNew fontSize='small'/>}
              />
              <Button alignContent='center' borderRadius='0' color="purple.main" size="md" fontSize="lg">
                Jan 1 - 7
              </Button>
              <IconButton 
                _hover={{
                  cursor: "pointer",
                }}
                color="purple.main"
                backgroundColor="grey.50"
                borderLeftRadius='0'
                aria-label="Previous Week"
                icon={<ArrowForwardIos fontSize='small'/>}
              />
            </Flex>

          </Flex>

          <Flex flexDir="row" height='100px' justifyContent="space-between">
            <Button
              variant="success"
              rightIcon={<Icon as={Edit} color="green.main" />}
              size="sm"
              onClick={() => {}}
              mr={5}
            >
              200 M-Bucks
            </Button>

            <Button
              variant="error"
              rightIcon={<Icon as={Edit} color="red.main" />}
              size="sm"
              onClick={() => {}}
            >
              0 Warnings
            </Button>
          </Flex>

        </Flex>

        <Flex justifyContent="space-between" mt={-5} ml={8} mr={10}>
          <Flex>
            <Button
              variant={ active === 'List' ? "primary" : "secondary" }
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
              variant={ active === 'Calendar' ? "primary" : "secondary" }
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

          <Button
            variant="primary"
            size="sm"
            onClick={() => {}}
          >
            Update Selected
          </Button>
        </Flex>

        <Flex justifyContent="space-between" mt={10} ml={8} mr={10}>
          <Heading>
            {scheduleData}
          </Heading>
        </Flex>

      </Flex>
  </Flex>
  );
};

export default SchedulePage;
