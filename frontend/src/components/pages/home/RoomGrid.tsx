import React, { useEffect, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import RoomCard from "./HomeRoomCard";
import { GET_ACTIVE_RESIDENTS } from "../../../APIClients/Queries/ResidentsQueries";
import { GET_TASKS_BY_STATUS } from "../../../APIClients/Queries/TaskQueries";

const RoomGrid = () => {
  const { data: residentData } = useQuery(GET_ACTIVE_RESIDENTS);

  const { data: pending } = useQuery(GET_TASKS_BY_STATUS, {
    variables: { status: "PENDING_APPROVAL" },
  });

  const { data: assigned } = useQuery(GET_TASKS_BY_STATUS, {
    variables: { status: "ASSIGNED" },
  });

  const fetchTasksForResident = (assigneeId: number) => {
    const assignedTasks = assigned?.getTasksByStatus?.filter((task: { assigneeId: number }) => task.assigneeId === assigneeId).length || 0;
    const pendingTasks = pending?.getTasksByStatus?.filter((task: { assigneeId: number }) => task.assigneeId === assigneeId).length || 0;
    return { assignedTasks, pendingTasks, loading: false, error: null };
  };

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
        {residentData?.getAllResidents?.map((room: { roomNumber: string; residentId: number; userId: number }) => {
          const { assignedTasks, pendingTasks } = fetchTasksForResident(room.userId);

          return (
            <RoomCard
              key={room.userId}
              room={room.roomNumber}
              residentId={room.residentId}
              assignedTasks={assignedTasks}
              pendingTasks={pendingTasks}
            />
          );
        })}
      </Grid>
    </Flex>
  );
};

export default RoomGrid;
