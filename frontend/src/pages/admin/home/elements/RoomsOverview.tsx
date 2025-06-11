import { Flex, Text, Grid, Button, Link } from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_PARTICIPANT_BY_ROOM } from "../../../../gql/queries";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { Status } from "../../../../types/TaskTypes";

type RoomData = {
  roomNumber: number;
  participantId: number;
  taskAssigned: number;
};

export default function RoomsOverview() {
  const client = useApolloClient();
  const isAvailable = true;

  const [roomData, setRoomData] = useState<RoomData[]>();
  const handleViewSchedule = (roomNumber: number) => {
    localStorage.setItem("scheduleSelectedRoom", roomNumber.toString());
  };

  useEffect(() => {
    console.log(roomData);
  }, [roomData]);

  useEffect(() => {
    const fetchRoomData = async () => {
      const results: RoomData[] = await Promise.all(
        ROOM_NUMBERS.map((room) => {
          const response = client.query({
            query: GET_PARTICIPANT_BY_ROOM,
            variables: { room_id: room },
          });
          let data = {
            roomNumber: room,
            participantId: 0,
            taskAssigned: 0,
          };
          response.then((response) => {
            return {
              roomNumber: room,
              participantId: response.data.participant_id || 0,
              taskAssigned:
                response.data.assigned_tasks
                  .filter(
                    (task: any) =>
                      task === Status.ASSIGNED || task === Status.INCOMPLETE
                  )
                  .length() || 0,
            };
          });
          return data;
        })
      );

      setRoomData(results);
    };

    fetchRoomData();
  }, []);
  return (
    <Flex
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      height="55%"
      marginRight="10px"
      marginBottom="10px"
      flexDir="column"
    >
      <Text textStyle="web.h3" color="primary.700" marginBottom="15px">
        Rooms
      </Text>
      <Flex
        overflow="scroll"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {roomData && (
          <Grid w="100%" templateColumns="repeat(5, 1fr)" gap="15px">
            {roomData.map((room: RoomData) => (
              <Flex
                key={room.roomNumber}
                minWidth="100px"
                minHeight="120px"
                border="1px solid"
                borderColor="neutral.300"
                borderRadius="8px"
                flexDir="column"
                justifyContent="space-between"
                alignItems="center"
                paddingBottom="10px"
                gap="10px"
              >
                <Text
                  textStyle="web.s1"
                  bg="primary.100"
                  width="100%"
                  textAlign="center"
                  padding="8px"
                  borderBottom="1px solid"
                  borderColor="neutral.300"
                >
                  Room #{room.roomNumber}
                </Text>

                {isAvailable ? (
                  <>
                    <Text textStyle="web.b3" textAlign="center">
                      ID Number: {room.participantId}
                      <Text as="span" textStyle="web.s1">
                        #123
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
                      Room is available.
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
