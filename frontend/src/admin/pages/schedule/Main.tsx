import React, { useEffect, useState } from "react";
import { Flex, Button, Text, Spinner, Box, HStack } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { ListIcon, CalendarIcon } from "./components/CustomIcons";
import RoomNavigation from "./components/RoomNavigation";
import ScheduleCalendar from "./components/ScheduleCalendar";
import ScheduleListView from "./components/ScheduleListView";
import MarillacBalanceModal from "./components/MarillacBalanceModal";
import TaskDetailsModal from "./components/TaskDetailsModal";
import { useScheduleData } from "./components/useScheduleData";
import { getCurrentWeekRange } from "../../../utils/scheduleUtils";
import { CalendarEvent, ScheduleView } from "./components/ScheduleTypes";
import "./components/ScheduleCalendar.css";
import OrangeButton from "../../common/buttons/OrangeButton";
import SimpleButton from "../../common/buttons/SimpleButton";
import AssignTaskModal from "./components/AssignTaskModal";
import WeekNavigation from "./components/WeekNavigation";

export default function AdminSchedulePage() {
  const [editMarillacBucks, setEditMarillacBucks] = useState(false);
  const [assignTask, setAssignTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<ScheduleView>(() => {
    const view = localStorage.getItem("scheduleView");
    if (!view) return ScheduleView.CALENDAR;
    return view as ScheduleView;
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const room = localStorage.getItem("scheduleSelectedRoom");
    if (!room) return 1;
    return parseInt(room, 10);
  });

  useEffect(() => {
    localStorage.setItem("scheduleSelectedRoom", selectedRoom.toString());
  }, [selectedRoom]);

  useEffect(() => {
    localStorage.setItem("scheduleView", currentView);
  }, [currentView]);

  const { loading, error, participantData, regularEvents, allDayEvents } =
    useScheduleData(selectedRoom, currentDate);

  return (
    <Flex direction="column" h="100%" w="100%">
      <RoomNavigation
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
      />

      <Box w="100%" flex={1} display="flex" flexDirection="column">
        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner color="primary.700" size="lg" />
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" h="400px">
            <Text color="red.500">An error occurred</Text>
          </Flex>
        ) : !participantData ? (
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
            {/* Top Header: Month, Week Navigation, M-Bucks */}
            <Flex justify="space-between" align="center" mb="15px">
              <Flex align="center" gap={4}>
                <Text textStyle="web.h2" color="primary.700">
                  {moment(currentDate).format("MMMM YYYY").toUpperCase()}
                </Text>

                <WeekNavigation
                  currentDate={currentDate}
                  onNavigate={setCurrentDate}
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
                  {participantData.marillac_bucks} M-Bucks
                </Text>
                <EditIcon
                  style={{
                    width: "17px",
                    height: "17px",
                  }}
                />
              </Button>
            </Flex>

            {/* Second Header: View Toggle and Assign Task Button */}
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

            {/* Content based on current view */}
            <Box flex={1} display="flex" flexDirection="column" minH={0}>
              {currentView === ScheduleView.LIST ? (
                <ScheduleListView
                  specificTasks={regularEvents}
                  anytimeTasks={allDayEvents}
                  anydayTasks={[]}
                  onTaskSelect={setSelectedTask}
                />
              ) : (
                <ScheduleCalendar
                  events={regularEvents}
                  allDayEvents={allDayEvents}
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

      {editMarillacBucks && participantData && (
        <MarillacBalanceModal
          close={() => setEditMarillacBucks(false)}
          participantId={participantData.participant_id}
          currentBalance={participantData.marillac_bucks}
          roomNumber={selectedRoom}
        />
      )}

      {assignTask && participantData && (
        <AssignTaskModal
          participantId={participantData.participant_id}
          isOpen={assignTask}
          onClose={() => setAssignTask(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </Flex>
  );
}
