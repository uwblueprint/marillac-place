import React, { useMemo } from "react";
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

type GetCurrentParticipantsResponse = {
  getCurrentParticipants: {
    pid: number;
    room: number;
  }[];
};

type GetNumberOfAssignedTasksResponse = {
  getNumberOfAssignedTasksByRoom: number[];
};

type RoomOverviewCard = {
  roomNumber: number;
  participantPid: number | null;
  assignedTasks: number;
};

export default function RoomsOverview() {
  const navigate = useNavigate();

  const {
    data: participantsData,
    loading: participantsLoading,
    error: participantsError,
  } = useQuery<GetCurrentParticipantsResponse>(GET_CURRENT_PARTICIPANTS);

  const {
    data: assignedTasksData,
    loading: assignedTasksLoading,
    error: assignedTasksError,
  } = useQuery<GetNumberOfAssignedTasksResponse>(
    GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM
  );

  const roomCards: RoomOverviewCard[] = useMemo(() => {
    const participantByRoom = new Map<number, number>();
    participantsData?.getCurrentParticipants.forEach(({ pid, room }) => {
      if (room) {
        participantByRoom.set(room, pid);
      }
    });

    const assignedTaskCounts =
      assignedTasksData?.getNumberOfAssignedTasksByRoom ?? [];

    return ROOM_NUMBERS.map((roomNumber) => ({
      roomNumber,
      participantPid: participantByRoom.get(roomNumber) ?? null,
      assignedTasks: assignedTaskCounts[roomNumber - 1] ?? 0,
    }));
  }, [participantsData, assignedTasksData]);

  const isLoading = participantsLoading || assignedTasksLoading;
  const errorMessage = participantsError?.message || assignedTasksError?.message;

  return (
    <Flex flexGrow={1}>
      <WidgetContainer
        width="100%"
        height="320px"
        paddingX="20px"
        paddingY="12px"
      >
        <Flex
          w="100%"
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
          px="2px"
          gap="12px"
        >
          <Text textStyle="web.h3" color="primary.700">
            Rooms
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
            Showing assigned tasks for current residents
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
              {roomCards.map((room) => (
                <Flex
                  key={room.roomNumber}
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
                    padding="10px"
                    borderBottom="1px solid"
                    borderColor="neutral.300"
                    borderTopRightRadius="8px"
                    borderTopLeftRadius="8px"
                  >
                    Room {room.roomNumber}
                  </Text>

                  {room.participantPid ? (
                    <>
                      <Flex flexDir="column" alignItems="center" gap="4px">
                        <Text textStyle="web.b3" textAlign="center">
                          Resident ID{" "}
                          <Text as="span" textStyle="web.s1">
                            #{room.participantPid}
                          </Text>
                        </Text>
                        <Text textStyle="web.b3" textAlign="center">
                          {room.assignedTasks} assigned task
                          {room.assignedTasks === 1 ? "" : "s"}
                        </Text>
                      </Flex>
                      <UnderlineButton
                        label="View Schedule"
                        href={ADMIN_SCHEDULE_PAGE}
                      />
                    </>
                  ) : (
                    <>
                      <Text textStyle="web.b3" textAlign="center">
                        Room Available
                      </Text>
                      <UnderlineButton
                        label="View Participants"
                        href={ADMIN_PARTICIPANTS_PAGE}
                      />
                    </>
                  )}
                </Flex>
              ))}
            </Grid>
          )}
        </Flex>
      </WidgetContainer>
    </Flex>
  );
}
