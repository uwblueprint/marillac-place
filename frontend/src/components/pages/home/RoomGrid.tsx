import React, { useEffect, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import RoomCard from "./HomeRoomCard";
import { TaskType } from "../../../types/TaskTypes";


import { GET_TASKS_BY_ASSIGNEE_ID } from "../../../APIClients/Queries/TaskQueries";
import { GET_ALL_RESIDENTS } from "../../../APIClients/Queries/ResidentsQueries";

// export const fetchRoomsWithTaskCounts = (assigneeId: number) => {
//   return useQuery(GET_TASKS_BY_ASSIGNEE_ID, {
//     variables: { assigneeId },
//   });
// };

function RoomGrid() {
  const { data: rooms, error: roomError, loading: roomLoading } = useQuery(GET_ALL_RESIDENTS);
  if (roomError) {
    return <div>Error</div>;
  }

  return roomLoading ? <div>load</div> : (
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
        {rooms.map((room: { roomNumber: string; residentId: number; userId: string }) => (
          <RoomCard room={room.roomNumber} residentId={room.residentId} key={room.userId} pendingTasks={1} assignedTasks={1} />
        ))}
      </Grid>
    </Flex>
  );
}

export default RoomGrid;
