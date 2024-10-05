import React from "react";
import {
  Flex,
} from "@chakra-ui/react";

import RoomCard from "../home/HomeRoomCard"
import { residentsMockData } from "../../../mocks/residents";
import { ScheduleCalendar } from "./ScheduleCalendar";

const renderRoomCards = residentsMockData.map(resident => 
  <RoomCard
    key={resident.residentId}
    room={resident.roomNumber}
    residentId={resident.residentId}
  />
)


const SchedulePage = (): React.ReactElement => {
  return (
    <Flex flexDir="column" flexGrow={1} p="20px">
      <h1>Schedule Page</h1>
      <Flex
        flexWrap="wrap" 
        justifyContent="flex-start" 
      >
        {renderRoomCards}
      </Flex>
      <ScheduleCalendar/>
    </Flex>
  );
};

export default SchedulePage;
