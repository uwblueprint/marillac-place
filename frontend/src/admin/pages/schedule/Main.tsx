import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Flex, Button, Text, Spinner, Box, HStack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { startOfWeek } from "date-fns";
import RoomNavigation from "./components/RoomNavigation";
import { DisplayView, ScheduleView } from "../../../constants/views";
import { formatDateInputValue, now } from "../../../helpers/formatDateTime";
import { AssignedTask } from "../../../types/models";
import { GET_ASSIGNED_TASKS_BY_WEEK } from "../../../gql/assignedTaskRequests";
import { GET_PARTICIPANT_BY_PID } from "../../../gql/participantRequests";
import { AdminContext } from "../../AdminContext";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import MarillacPlaceCalendar from "../../../ui/misc/MarillacPlaceCalendar";

export default function AdminSchedulePage() {
  const location = useLocation();
  const { room, view } = location.state || {
    room: 1,
    view: ScheduleView.CALENDAR,
  };
  const { roomToParticipant } = useContext(AdminContext);

  const [selectedRoom, setSelectedRoom] = useState<number>(room);
  const [currentView, setCurrentView] = useState<ScheduleView>(view);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(now()));

  const [assignTask, setAssignTask] = useState(false);
  const [viewTaskDetails, setViewTaskDetails] = useState<AssignedTask | null>(
    null
  );
  const [editMarillacBucks, setEditMarillacBucks] = useState(false);

  const {
    data: assignedTasksData,
    loading: assignedTasksLoading,
    error: assignedTasksError,
    refetch: refetchAssignedTasksByWeek,
  } = useQuery(GET_ASSIGNED_TASKS_BY_WEEK, {
    variables: {
      pid: roomToParticipant[selectedRoom],
      weekStart: formatDateInputValue(weekStart),
    },
    skip: !(selectedRoom in roomToParticipant),
  });

  const {
    data: participantData,
    loading: participantLoading,
    error: participantError,
    refetch: refetchParticipantById,
  } = useQuery(GET_PARTICIPANT_BY_PID, {
    variables: {
      pid: roomToParticipant[selectedRoom],
    },
    skip: !(selectedRoom in roomToParticipant),
  });

  useEffect(() => {
    if (selectedRoom in roomToParticipant) {
      refetchParticipantById({
        variables: {
          pid: roomToParticipant[selectedRoom],
        },
      });
    }
  }, [selectedRoom, roomToParticipant]);

  useEffect(() => {
    if (selectedRoom in roomToParticipant) {
      refetchAssignedTasksByWeek({
        variables: {
          pid: roomToParticipant[selectedRoom],
          weekStart: formatDateInputValue(weekStart),
        },
      });
    }
  }, [selectedRoom, weekStart]);

  if (participantLoading || assignedTasksLoading) return <LoadingScreen />;
  if (participantError || assignedTasksError) return <ErrorScreen />;

  return (
    <>
      <RoomNavigation
        selectedRoom={selectedRoom}
        changeRoom={setSelectedRoom}
      />

      <MarillacPlaceCalendar
        assignedTasks={assignedTasksData?.getAssignedTasksByWeek ?? []}
        startDate={weekStart}
        setStartDate={setWeekStart}
        viewTaskDetails={setViewTaskDetails}
        view={DisplayView.WEB}
      />

      {/* <Box w="100%" flex={1} display="flex" flexDirection="column">
        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner color="primary.700" size="lg" />
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" h="400px">
            <Text color="red.500">{error.message}</Text>
          </Flex>
        ) : !participantId ? (
          <Flex
            w="100%"
            h="80%"
            justify="center"
            align="center"
            direction="column"
            gap={4}
          >
            <Text textStyle="web.h2" color="text.light.disabled">
              This room is empty
            </Text>
            <OrangeButton
              text="Add Participant"
              action={() => {
                window.location.href = "/admin/participants";
              }}
              is_active={false}
            />
          </Flex>
        ) : (
          <Flex direction="column" flex={1} minH={0}>
            <Flex justify="space-between" align="center" mb="15px">
              <Flex align="center" gap={4}>
                <Text textStyle="web.h2" color="primary.700">
                  {moment(currentDate).format("MMMM YYYY").toUpperCase()}
                </Text>

                <SimpleButton
                  text={getCurrentWeekRange(currentDate)}
                  action={() => {}}
                  is_active
                  text_color="#0C727E"
                />
              </Flex>

              <Button
                padding="0px 15px"
                color="#0D8312"
                border="1px solid"
                borderColor="#0D8312"
                borderRadius="8px"
                bg="#ECFFED"
                gap="5px"
                _hover={{ background: "#C9DEC9" }}
                onClick={() => setEditMarillacBucks(true)}
              >
                <Text textStyle="web.b2" fontWeight={700} color="inherit">
                  {marillacBucks} M-Bucks
                </Text>
                <EditIcon
                  style={{
                    width: "17px",
                    height: "17px",
                  }}
                />
              </Button>
            </Flex>

            <Flex justify="space-between" align="center" mb={5}>
              <HStack spacing={0}>
                <Button
                  fontWeight={700}
                  fontSize="12px"
                  variant={
                    currentView === ScheduleView.LIST
                      ? "primaryFilled"
                      : "primaryOutline"
                  }
                  borderRightRadius="0"
                  onClick={() => setCurrentView(ScheduleView.LIST)}
                  leftIcon={
                    <ListIcon
                      color={
                        currentView === ScheduleView.LIST ? "white" : "#E67D4F"
                      }
                    />
                  }
                >
                  List
                </Button>
                <Button
                  fontWeight={700}
                  fontSize="12px"
                  variant={
                    currentView === ScheduleView.CALENDAR
                      ? "primaryFilled"
                      : "primaryOutline"
                  }
                  borderLeftRadius="0"
                  onClick={() => setCurrentView(ScheduleView.CALENDAR)}
                  leftIcon={
                    <CalendarIcon
                      color={
                        currentView === ScheduleView.CALENDAR
                          ? "white"
                          : "#E67D4F"
                      }
                    />
                  }
                >
                  Calendar
                </Button>
              </HStack>

              <OrangeButton
                text="Assign Task"
                action={() => setAssignTask(true)}
                is_active={assignTask}
              />
            </Flex>

            <Box flex={1} display="flex" flexDirection="column" minH={0}>
              {currentView === ScheduleView.LIST ? (
                <ScheduleListView
                  specificTasks={specificTasks}
                  anytimeTasks={anytimeTasks}
                  anydayTasks={anydayTasks}
                  onTaskSelect={setSelectedTask}
                />
              ) : (
                <ScheduleCalendar
                  events={specificTasks}
                  allDayEvents={[...anydayTasks, ...anytimeTasks]}
                  currentDate={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={setSelectedTask}
                  scrollToTime={moment().hour(8).minute(0).toDate()}
                />
              )}
            </Box>
          </Flex>
        )}
      </Box>

      {editMarillacBucks && participantId && (
        <MarillacBalanceModal
          close={() => setEditMarillacBucks(false)}
          participantId={participantId}
          currentBalance={marillacBucks}
          roomNumber={selectedRoom}
        />
      )}

      {assignTask && participantId && (
        <AssignTaskModal
          participantId={participantId}
          isOpen={assignTask}
          onClose={() => setAssignTask(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )} */}
    </>
  );
}
