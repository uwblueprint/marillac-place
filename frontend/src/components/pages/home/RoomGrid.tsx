import React, { useEffect, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import RoomCard from "./HomeRoomCard";

const rooms = [
  { id: 1, name: "1", info: "Info about Room 1" },
  { id: 2, name: "2", info: "Info about Room 2" },
  { id: 3, name: "3", info: "Info about Room 3" },
  { id: 4, name: "4", info: "Info about Room 4" },
  { id: 5, name: "5", info: "Info about Room 5" },
  { id: 6, name: "6", info: "Info about Room 6" },
  { id: 7, name: "7", info: "Info about Room 7" },
  { id: 8, name: "8", info: "Info about Room 8" },
  { id: 9, name: "9", info: "Info about Room 9" },
  { id: 10, name: "10", info: "Info about Room 10" },
  { id: 11, name: "11", info: "Info about Room 11" },
];

function RoomGrid() {
  return (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <Grid
        templateColumns={{
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap="20px"
        width="100%"
      >
        {rooms.map((room) => (
          <RoomCard room={room.name} residentId={room.id} key={room.id} />
        ))}
      </Grid>
    </Flex>
  );
}

export default RoomGrid;
