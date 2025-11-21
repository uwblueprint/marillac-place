import { Flex, Text, Grid, Link } from "@chakra-ui/react";
import { useQuery, useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_CURRENT_PARTICIPANTS } from "../../../../gql/participantRequests";
import { GET_ASSIGNED_TASKS_FOR_TODAY } from "../../../../gql/assignedTaskRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

type RoomData = {
  roomNumber: number;
  participantId: number | null;
  taskAssigned: number;
};

enum Status {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  ASSIGNED = "ASSIGNED",
  INCOMPLETE = "INCOMPLETE",
  COMPLETE = "COMPLETE",
  EXCUSED = "EXCUSED",
}

export default function RoomsOverview() {
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const {
    data: participantsData,
    loading,
    error,
  } = useQuery(GET_CURRENT_PARTICIPANTS);

  const client = useApolloClient();

  const handleViewSchedule = (roomNumber: number) => {
    localStorage.setItem("scheduleSelectedRoom", roomNumber.toString());
  };

  useEffect(() => {
    let isActive = true;

    const fetchAllRooms = async () => {
      const participants: any[] =
        participantsData?.getCurrentParticipants ?? [];

      const results: RoomData[] = await Promise.all(
        ROOM_NUMBERS.map(async (roomNumber) => {
          const participant = participants.find((p) => p.room === roomNumber);
          if (!participant) {
            return { roomNumber, participantId: null, taskAssigned: 0 };
          }

          const { pid } = participant;
          try {
            const resp = await client.query({
              query: GET_ASSIGNED_TASKS_FOR_TODAY,
              variables: { pid },
            });

            const assignedTasks: any[] =
              resp?.data?.getAssignedTasksForToday ?? [];
            const taskAssigned = assignedTasks.filter((t) => {
              const status = t.status ?? t.task_status;
              return status === Status.ASSIGNED || status === Status.INCOMPLETE;
            }).length;

            return { roomNumber, participantId: pid, taskAssigned };
          } catch (e) {
            /* eslint-disable-next-line no-console */
            console.warn("Error fetching assigned tasks for pid", pid, e);
            return { roomNumber, participantId: pid, taskAssigned: 0 };
          }
        })
      );
      if (isActive) {
        setRoomData(results);
      }
    };

    fetchAllRooms();

    return () => {
      isActive = false;
    };
  }, [participantsData, client]);

  return (
    <Flex
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      height="320px"
      marginRight="10px"
      marginBottom="10px"
      flexDir="column"
      gap="10px"
      justifyContent="flex-start"
    >
      <Flex
        w="100%"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="center"
        px="2px"
        gap="20px"
      >
        <Text textStyle="web.h3" color="primary.700">
          Rooms
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
          Showing pending tasks for today
        </Text>
      </Flex>
      <Flex
        h="100%"
        overflow="scroll"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {loading ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            Loading...
          </Text>
        ) : error ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            {error?.message || "An error occured."}
          </Text>
        ) : (
          <Grid w="100%" h="100%" templateColumns="repeat(5, 1fr)" gap="10px">
            {roomData.map((room: RoomData) => (
              <Flex
                key={room.roomNumber}
                border="1px solid"
                borderColor="neutral.300"
                borderRadius="8px"
                flexDir="column"
                justifyContent="space-between"
                alignItems="center"
                paddingBottom="10px"
                gap="5px"
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
                  Room {room.roomNumber}
                </Text>

                {room.participantId ? (
                  <>
                    <Text textStyle="web.b3" textAlign="center">
                      ID Number:{" "}
                      <Text as="span" textStyle="web.s1">
                        #{room.participantId}
                      </Text>
                    </Text>
                    <Text textStyle="web.b3" textAlign="center">
                      {room.taskAssigned} Assigned Tasks
                    </Text>
                    <Link
                      onClick={() => handleViewSchedule(room.roomNumber)}
                      href="/admin/schedule"
                      textDecoration="underline"
                      textAlign="center"
                      textStyle="web.b3"
                      fontFamily="Nunito"
                      fontWeight={600}
                      color="black"
                      _hover={{
                        textDecoration: "none",
                      }}
                    >
                      View Schedule
                    </Link>
                  </>
                ) : (
                  <>
                    <Text textStyle="web.b3" textAlign="center">
                      Room Available.
                    </Text>
                    <Link
                      href="/admin/participants"
                      textDecoration="underline"
                      textAlign="center"
                      textStyle="web.b3"
                      fontFamily="Nunito"
                      fontWeight={600}
                      color="black"
                      _hover={{
                        textDecoration: "none",
                      }}
                    >
                      View Participants
                    </Link>
                  </>
                )}
              </Flex>
            ))}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
}
