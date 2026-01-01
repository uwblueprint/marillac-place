import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flex, Button, Text, HStack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { startOfWeek } from "date-fns";
import RoomNavigation from "./components/RoomNavigation";
import { DisplayView, ScheduleView } from "../../../constants/views";
import { AssignedTask } from "../../../types/models";
import { GET_ASSIGNED_TASKS_BY_WEEK } from "../../../gql/assignedTaskRequests";
import { GET_PARTICIPANT_BY_PID } from "../../../gql/participantRequests";
import { AdminContext } from "../../AdminContext";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import MarillacPlaceCalendar from "../../../ui/misc/MarillacPlaceCalendar";
import OrangeButton from "../../../ui/buttons/OrangeButton";
import { ADMIN_PARTICIPANTS_PAGE } from "../../../constants/routes";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";
import { Calendar, List } from "../../../ui/icons/MiscIcons";
import { Marker } from "../../../ui/icons/ActionIcons";
import AnyDayTasksTable from "./components/AnyDayTasksTable";
import DailyTasksTable from "./components/DailyTasksTable";
import MarillacBalanceModal from "./components/MarillacBalanceModal";
import AssignTaskModal from "./components/AssignTaskModal";
import TaskDetailsModal from "./components/TaskDetailsModal";
import { formatDateV5 } from "../../../helpers/formatDateTime";

export default function AdminSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, view } = location.state || {
    room: 1,
    view: ScheduleView.CALENDAR,
  };
  const { roomToParticipant } = useContext(AdminContext);

  const weekStart = startOfWeek(new Date());
  const [selectedRoom, setSelectedRoom] = useState<number>(room);
  const [currentView, setCurrentView] = useState<ScheduleView>(view);

  const [assignTask, setAssignTask] = useState(false);
  const [viewTaskDetails, setViewTaskDetails] = useState<AssignedTask | null>(
    null
  );
  const [editMarillacBucks, setEditMarillacBucks] = useState<boolean>(false);

  const {
    data: assignedTasksData,
    loading: assignedTasksLoading,
    error: assignedTasksError,
    refetch: refetchAssignedTasksByWeek,
  } = useQuery(GET_ASSIGNED_TASKS_BY_WEEK, {
    variables: {
      pid: roomToParticipant[selectedRoom],
      weekStart: weekStart.toISOString(),
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
          weekStart: weekStart.toISOString(),
        },
      });
    }
  }, [selectedRoom]);

  if (participantLoading || assignedTasksLoading) return <LoadingScreen />;
  if (participantError || assignedTasksError) return <ErrorScreen />;

  return (
    <Flex flexDir="column" gap="10px" width="100%" h="fit-content">
      <RoomNavigation
        selectedRoom={selectedRoom}
        changeRoom={setSelectedRoom}
      />

      {selectedRoom in roomToParticipant ? (
        <>
          <Flex alignItems="center" justifyContent="space-between" w="100%">
            <Text textStyle="web.h2" color="primary.700" pl="3px">
              {formatDateV5(weekStart)}
            </Text>
            <GreenOutlineButton
              label={
                (participantData?.getParticipantByPid?.balance ?? 0) +
                " M-Bucks"
              }
              action={() => setEditMarillacBucks(true)}
              is_active={editMarillacBucks}
              icon={<Marker color="currentColor" />}
            />
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" w="100%">
            <HStack spacing={0}>
              <Button
                onClick={() => setCurrentView(ScheduleView.LIST)}
                isActive={currentView === ScheduleView.LIST}
                leftIcon={<List color="currentColor" />}
                width="115px"
                height="30px"
                paddingX="12px"
                paddingY="6px"
                borderLeftRadius="8px"
                borderRightRadius="0px"
                border="1px solid"
                borderColor="#E67D4F"
                bg="#FFFFFF"
                color="#E67D4F"
                _hover={{
                  bg: "#E67D4F",
                  color: "#FFFFFF",
                }}
                _active={{
                  bg: "#E67D4F",
                  color: "#FFFFFF",
                }}
              >
                <Text textStyle="web.s1" color="inherit">
                  List
                </Text>
              </Button>
              <Button
                onClick={() => setCurrentView(ScheduleView.CALENDAR)}
                isActive={currentView === ScheduleView.CALENDAR}
                leftIcon={<Calendar color="currentColor" />}
                width="115px"
                height="30px"
                paddingX="12px"
                paddingY="6px"
                borderLeftRadius="0px"
                borderRightRadius="8px"
                border="1px solid"
                borderColor="#E67D4F"
                bg="#FFFFFF"
                color="#E67D4F"
                _hover={{
                  bg: "#E67D4F",
                  color: "#FFFFFF",
                }}
                _active={{
                  bg: "#E67D4F",
                  color: "#FFFFFF",
                }}
              >
                <Text textStyle="web.s1" color="inherit">
                  Calendar
                </Text>
              </Button>
            </HStack>
            <OrangeButton
              label="Assign Task"
              action={() => setAssignTask(true)}
              is_active={assignTask}
            />
          </Flex>

          {currentView === ScheduleView.CALENDAR ? (
            <MarillacPlaceCalendar
              assignedTasks={assignedTasksData?.getAssignedTasksByWeek ?? []}
              startDate={weekStart}
              viewTaskDetails={setViewTaskDetails}
              view={DisplayView.WEB}
            />
          ) : (
            <>
              <Text textStyle="web.h2" color="primary.700" pl="3px">
                Daily
              </Text>
              <DailyTasksTable
                tasks={assignedTasksData?.getAssignedTasksByWeek ?? []}
                onTaskSelect={setViewTaskDetails}
                error={assignedTasksError}
                loading={assignedTasksLoading}
              />
              <Text textStyle="web.h2" color="primary.700" pl="3px">
                Any Day
              </Text>
              <AnyDayTasksTable
                tasks={assignedTasksData?.getAssignedTasksByWeek ?? []}
                onTaskSelect={setViewTaskDetails}
                error={assignedTasksError}
                loading={assignedTasksLoading}
              />
            </>
          )}

          {editMarillacBucks && (
            <MarillacBalanceModal
              currentBalance={
                participantData?.getParticipantByPid?.balance ?? 0
              }
              participantId={roomToParticipant[selectedRoom]}
              close={() => setEditMarillacBucks(false)}
              refetchParticipant={refetchParticipantById}
            />
          )}

          {assignTask && (
            <AssignTaskModal
              participantId={roomToParticipant[selectedRoom]}
              onClose={() => setAssignTask(false)}
              refetchAssignedTasks={refetchAssignedTasksByWeek}
            />
          )}

          {viewTaskDetails && (
            <TaskDetailsModal
              task={viewTaskDetails}
              onClose={() => setViewTaskDetails(null)}
              refetch={refetchAssignedTasksByWeek}
            />
          )}
        </>
      ) : (
        <Flex
          w="100%"
          h="80%"
          justify="center"
          align="center"
          direction="column"
          gap={4}
        >
          <Text textStyle="web.h3" color="text.light.disabled">
            This room is empty
          </Text>
          <OrangeButton
            label="Add Participant"
            action={() => navigate(ADMIN_PARTICIPANTS_PAGE)}
            is_active={false}
          />
        </Flex>
      )}
    </Flex>
  );
}
