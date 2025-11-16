import React, { useContext, useMemo, useState } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import {
  GET_CURRENT_PARTICIPANTS,
} from "../../../../gql/participantRequests";
import { GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM } from "../../../../gql/assignedTaskRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { ADMIN_PARTICIPANTS_PAGE, ADMIN_SCHEDULE_PAGE, ADMIN_ANNOUNCEMENTS_PAGE } from "../../../../constants/routes";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { Participant } from "../../../../types/models";
import { ParticipantContext } from "../../../../participant/ParticipantContext";
import { AdminContext } from "../../../AdminContext";

type RoomOverviewInfo = {
  room: number;
  participant: number | null;
  assignedTaskCount: number;
};

export default function RoomsOverview() {
  const navigate = useNavigate();
  const adminContext = useContext(AdminContext);
  const [error, setError] = useState("");

  const {
    data: assignedTasksData,
    loading: assignedTasksLoading,
    error: assignedTasksError,
  } = useQuery<{ getNumberOfAssignedTasksByRoom: number[] }>(GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM);

  const roomOverviewInfo: RoomOverviewInfo[] = useMemo(() => {
    if (!adminContext) {
      setError("error fetching admin context");
      return [];
    }
    const participantByRoom = adminContext?.roomToParticipant;

    const assignedTaskCounts =
      assignedTasksData?.getNumberOfAssignedTasksByRoom ?? [];

    return ROOM_NUMBERS.map((room) => ({
      room,
      participant: participantByRoom?.[room],
      assignedTaskCount: assignedTaskCounts[room - 1] ?? 0,
    }));
  }, [adminContext, assignedTasksData]);

  const isLoading = assignedTasksLoading;
  const errorMessage = error || assignedTasksError?.message || "";

  return (
    <WidgetContainer 
      width="100%" 
      height="320px" 
      paddingX="16px" 
      paddingY="16px"
      loading={isLoading}
      error={errorMessage}
    >
      <Flex
        w="100%"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="center"
        pl="2px"
        pb="4px"
        gap="12px"
      >
        <Text textStyle="web.h3" color="primary.700">
          Rooms
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
          Showing assigned tasks for current participants
        </Text>
      </Flex>
        <Flex
          flex="1"
          overflowY="auto"
          justifyContent="center"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {isLoading ? (
            <Text textStyle="web.b2" color="text.light.secondary">
              Loading...
            </Text>
          ) : errorMessage ? (
            <Text textStyle="web.b2" color="text.light.secondary">
              {errorMessage}
            </Text>
          ) : (
            <Grid w="100%" h="100%" templateColumns="repeat(5, 1fr)" gap="10px">
              {roomOverviewInfo.map((room) => (
                <Flex
                  key={room.room}
                  border="1px solid"
                  borderColor="neutral.300"
                  borderRadius="8px"
                  flexDir="column"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingBottom="12px"
                  gap="12px"
                  bg="neutral.0"
                >
                  <Text
                    textStyle="web.s1"
                    bg="primary.100"
                    width="100%"
                    textAlign="center"
                    padding="8px"
                    borderBottom="1px solid"
                    borderColor="neutral.300"
                    borderTopRightRadius="8px"
                    borderTopLeftRadius="8px"
                  >
                    Room {room.room}
                  </Text>

                  {room.participant ? (
                    <>
                      <Flex flexDir="column" alignItems="center" gap="4px">
                        <Text textStyle="web.b3" textAlign="center">
                          Resident ID{" "}
                          <Text as="span" textStyle="web.s1">
                            #{room.participant}
                          </Text>
                        </Text>
                        <Text textStyle="web.b3" textAlign="center">
                          {room.assignedTaskCount} assigned task{room.assignedTaskCount === 1 ? "" : "s"}
                        </Text>
                      </Flex>
                      <UnderlineButton
                        label="View Schedule"
                        action={() => navigate(ADMIN_SCHEDULE_PAGE)}
                      />
                    </>
                  ) : (
                    <>
                      <Text textStyle="web.b3" textAlign="center">
                        Room Available
                      </Text>
                      <UnderlineButton
                        label="View Participants"
                        action={() => navigate(ADMIN_PARTICIPANTS_PAGE)}
                      />
                    </>
                  )}
                </Flex>
              ))}
            </Grid>
          )}
        </Flex>
      </WidgetContainer>
  );
}
