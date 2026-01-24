import { Button, Divider, Flex, HStack, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { endOfDay, isEqual, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { useLocation } from "react-router-dom";
import { ParticipantContext } from "../../ParticipantContext";
import { GET_ASSIGNED_TASKS_BY_WEEK } from "../../../gql/assignedTaskRequests";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import { DisplayView, ScheduleView } from "../../../constants/views";
import { formatDateV1, formatDateV2, formatDateV6, formatDateV7 } from "../../../helpers/formatDateTime";
import MarillacPlaceCalendar from "../../../ui/misc/MarillacPlaceCalendar";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import { Calendar, List } from "../../../ui/icons/MiscIcons";
import { AssignedTask } from "../../../types/models";
import TaskDetailsModal from "./components/TaskDetailsModal";
import { TaskStatus } from "../../../types/enums";
import { Assigned, Complete, Excused, Incomplete } from "../../../ui/icons/StatusIcons";
import { Comment } from "../../../ui/icons/ActionIcons";

export default function ParticipantsSchedulePage() {
  const { pid } = useContext(ParticipantContext);
  const location = useLocation();
  const { view } = location.state || { view: ScheduleView.LIST };
  const [currentView, setCurrentView] = useState<ScheduleView>(view);
  const [viewTaskDetails, setViewTaskDetails] = useState<AssignedTask | null>(null);

  const { data, loading, error } = useQuery(GET_ASSIGNED_TASKS_BY_WEEK, {
    variables: { pid, weekStart: startOfWeek(new Date()).toISOString() },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || pid === -1) {
    return <ErrorScreen message="Failed to load assigned tasks. Please try again later." />;
  }

  const tasks = data?.getAssignedTasksByWeek ?? [];

  return (
    <>
      <Flex w="100%" mb="12px" justifyContent="space-between" alignItems="center">
        <Text color="brand.primaryDark" textStyle="h3">
          {currentView === ScheduleView.CALENDAR ? formatDateV1(new Date()) : "This Week"}
        </Text>
        <HStack spacing={0}>
          <Button
            onClick={() => setCurrentView(ScheduleView.LIST)}
            isActive={currentView === ScheduleView.LIST}
            width="30px"
            height="30px"
            padding="0px"
            borderLeftRadius="8px"
            borderRightRadius="0px"
            border="1px solid"
            borderColor="#E67D4F"
            bg="white"
            color="brand.secondaryDark"
            _hover={{
              bg: "brand.secondaryDark",
              color: "white",
            }}
            _active={{
              bg: "brand.secondaryDark",
              color: "white",
            }}
          >
            <List color="currentColor" size={12} />
          </Button>
          <Button
            onClick={() => setCurrentView(ScheduleView.CALENDAR)}
            isActive={currentView === ScheduleView.CALENDAR}
            width="30px"
            height="30px"
            borderLeftRadius="0px"
            borderRightRadius="8px"
            border="1px solid"
            borderColor="#E67D4F"
            padding="0px"
            bg="white"
            color="#E67D4F"
            _hover={{
              bg: "brand.secondaryDark",
              color: "white",
            }}
            _active={{
              bg: "brand.secondaryDark",
              color: "white",
            }}
          >
            <Calendar color="currentColor" size={16} />
          </Button>
        </HStack>
      </Flex>

      {currentView === ScheduleView.CALENDAR ? (
        <MarillacPlaceCalendar
          assignedTasks={tasks}
          startDate={startOfDay(new Date())}
          viewTaskDetails={setViewTaskDetails}
          view={DisplayView.MOBILE}
        />
      ) : (
        <Flex flexDir="column" gap="12px">
          {tasks.map((task: AssignedTask, index: number) => {
            const noSpecificTime = (
              isEqual(startOfDay(new Date(task.start_date)), new Date(task.start_date)) &&
              isEqual(endOfDay(new Date(task.end_date)), new Date(task.end_date))
            );
            const showDayHeader = (
              index === 0 || 
              !isSameDay(new Date(task.start_date), new Date(tasks[index - 1].start_date))
            );

            return (
              <>
                {showDayHeader && (
                  <>
                    <Divider borderColor="background.border" />
                    <Text textStyle="s1">{formatDateV7(new Date(task.start_date))}</Text>
                  </>
                )}
                <Flex key={index} justifyContent="space-between" alignItems="center" onClick={() => setViewTaskDetails(task)} cursor="pointer">
                  <Flex alignItems="center" gap="12px">
                    {task.status === TaskStatus.ASSIGNED && <Assigned />}
                    {task.status === TaskStatus.COMPLETE && <Complete />}
                    {task.status === TaskStatus.EXCUSED && <Excused />}
                    {task.status === TaskStatus.INCOMPLETE && <Incomplete />}
                    <Text textStyle="b1">{task.name}</Text>
                    {task.comment && <Comment size={12} />}
                  </Flex>
                  <Text textStyle="b2" color="text.medium">{noSpecificTime ? "Anytime" : formatDateV2(new Date(task.start_date)) + " to " + formatDateV2(new Date(task.end_date))}</Text>
                </Flex>
              </>
            )
          })}
        </Flex>
      )}

      {viewTaskDetails && (
        <TaskDetailsModal task={viewTaskDetails} onClose={() => setViewTaskDetails(null)} />
      )}
    </>
  );
}
