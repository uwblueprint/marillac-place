import React, { useEffect, useState } from "react";
import { Grid, Box, Text } from '@chakra-ui/react';

const rooms = [
  { id: 1, name: 'Room 1', info: 'Info about Room 1' },
  { id: 2, name: 'Room 2', info: 'Info about Room 2' },
  { id: 3, name: 'Room 3', info: 'Info about Room 3' },
  { id: 4, name: 'Room 4', info: 'Info about Room 4' },
  { id: 5, name: 'Room 5', info: 'Info about Room 5' },
  { id: 6, name: 'Room 6', info: 'Info about Room 6' },
  { id: 7, name: 'Room 7', info: 'Info about Room 7' },
  { id: 8, name: 'Room 8', info: 'Info about Room 8' },
  { id: 9, name: 'Room 9', info: 'Info about Room 9' },
  { id: 10, name: 'Room 10', info: 'Info about Room 10' },
];

function RoomGrid() {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={2}>
      {rooms.map((room) => (
        <Box key={room.id} p={4} borderWidth="2px" borderColor="grey.300" borderRadius="5px" w="100%" h="100%" bg="white">
          <Text fontWeight="bold">{room.name}</Text>
          <Text>{room.info}</Text>
        </Box>
      ))}
    </Grid>
  );
}

export default RoomGrid;