import { Flex, Text, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM } from "../../../../gql/assignedTaskRequests";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { AdminContext } from "../../../AdminContext";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ADMIN_PARTICIPANTS_PAGE } from "../../../../constants/routes";
import { ScheduleView } from "../../../../constants/views";

export default function RoomsOverview() {
  const { roomToParticipant } = useContext(AdminContext);
  const { data, loading, error } = useQuery(
    GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM
  );

  const navigate = useNavigate();
  const handleViewSchedule = (roomNumber: number) => {
    navigate("/admin/schedule", {
      state: {
        room: roomNumber,
        view: ScheduleView.CALENDAR,
      },
    });
  };

  return (
    <WidgetContainer
      bg_color="transparent"
      width="100%"
      height="320px"
      paddingY="12px"
      paddingX="20px"
      loading={loading}
      error={error?.message}
    >
      <Flex
        w="100%"
        h="40px"
        flexDir="row"
        justifyContent="flex-start"
        alignItems="baseline"
        gap="10px"
        paddingBottom="10px"
      >
        <Text textStyle="h3" color="brand.primaryDark" pl="5px">
          Rooms
        </Text>
        <Text textStyle="b2" color="text.light">
          Showing pending tasks for this week
        </Text>
      </Flex>
      <Grid
        w="100%"
        h="calc(100% - 40px)"
        templateColumns="repeat(5, 1fr)"
        gap="10px"
      >
        {ROOM_NUMBERS.map((room: number) => (
          <WidgetContainer
            key={room}
            bg_color="transparent"
            paddingY="0px"
            paddingX="0px"
            width="100%"
            height="100%"
          >
            <Text
              textStyle="s2"
              bg="brand.primaryLight"
              width="100%"
              textAlign="center"
              padding="6px"
              borderBottom="1px solid"
              borderColor="background.border"
              borderTopRightRadius="8px"
              borderTopLeftRadius="8px"
            >
              Room {room}
            </Text>
            {room in roomToParticipant ? (
              <>
                <Text textStyle="b2" textAlign="center" mt="10px">
                  ID Number: <b>#{roomToParticipant[room]}</b>
                </Text>
                <Text textStyle="b2" textAlign="center" mt="6px">
                  {data?.getNumberOfAssignedTasksByRoom[room - 1]} Assigned
                  Tasks
                </Text>
                <Flex
                  position="absolute"
                  bottom="10px"
                  left="0"
                  justifyContent="center"
                  width="100%"
                >
                  <UnderlineButton
                    label="View Schedule"
                    action={() => handleViewSchedule(room)}
                  />
                </Flex>
              </>
            ) : (
              <>
                <Text textStyle="b2" textAlign="center" mt="25px">
                  Room Available.
                </Text>
                <Flex
                  position="absolute"
                  bottom="10px"
                  left="0"
                  justifyContent="center"
                  width="100%"
                >
                  <UnderlineButton
                    label="View Participants"
                    action={() => navigate(ADMIN_PARTICIPANTS_PAGE)}
                  />
                </Flex>
              </>
            )}
          </WidgetContainer>
        ))}
      </Grid>
    </WidgetContainer>
  );
}
