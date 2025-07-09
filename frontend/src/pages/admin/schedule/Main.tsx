import React, { useState } from "react";
import {
  Flex,
  Button,
  Text,
  Spinner,
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import moment from "moment";
import { ListIcon, CalendarIcon } from "../../../components/admin/CustomIcons";
import RoomNavigation from "../../../components/admin/RoomNavigation";
import ScheduleCalendar from "../../../components/admin/ScheduleCalendar";
import ScheduleListView from "../../../components/admin/ScheduleListView";
import MarillacBalanceModal from "./elements/MarillacBalanceModal";
import TaskDetailsModal from "./elements/TaskDetailsModal";
import { useScheduleData } from "../../../hooks/useScheduleData";
import { getCurrentWeekRange } from "../../../utils/scheduleUtils";
import { CalendarEvent, ScheduleView } from "../../../types/ScheduleTypes";
import "./elements/ScheduleCalendar.css";

export default function AdminSchedulePage() {
  const [editMarillacBucks, setEditMarillacBucks] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<ScheduleView>(
    ScheduleView.CALENDAR
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    return moment().format("dddd");
  });
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const room = localStorage.getItem("scheduleSelectedRoom");
    if (!room) return 1;
    return parseInt(room, 10);
  });

  const { loading, error, participantData, regularEvents, allDayEvents } =
    useScheduleData(selectedRoom, currentDate);

  // Navigate to previous/next week
  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = moment(currentDate)
      .add(direction === "next" ? 1 : -1, "week")
      .toDate();
    setCurrentDate(newDate);
  };

  const handleRoomChange = (room: number) => {
    setSelectedRoom(room);
  };

  const handleTaskSelect = (event: CalendarEvent) => {
    setSelectedTask(event);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <Flex direction="column" h="100%" w="100%">
      {/* Room Navigation */}
      <RoomNavigation
        selectedRoom={selectedRoom}
        onRoomChange={handleRoomChange}
      />

      {/* Main Content */}
      <Box p={4} w="100%" flex={1} display="flex" flexDirection="column">
        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" h="400px">
            <Text color="red.500">{error.message}</Text>
          </Flex>
        ) : !participantData ? (
          <Flex
            justify="center"
            align="center"
            h="400px"
            direction="column"
            gap={4}
          >
            <Text fontSize="xl" color="gray.500">
              This room is empty
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => {
                window.location.href = "/admin/participants";
              }}
            >
              Add Participant
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" flex={1} minH={0}>
            {/* Top Header: Month, Week Navigation, M-Bucks */}
            <Flex justify="space-between" align="center" mb={6}>
              <Flex align="center" gap={4}>
                <Text fontSize="3xl" fontWeight="bold" color="primary.700">
                  {moment(currentDate).format("MMMM YYYY").toUpperCase()}
                </Text>

                <Flex
                  align="center"
                  gap={1}
                  border="1px solid"
                  borderColor="neutral.300"
                  borderRadius="8px"
                  bg="white"
                  px={1}
                  py={0.5}
                >
                  <IconButton
                    aria-label="Previous week"
                    icon={
                      <Text
                        fontSize="14px"
                        fontWeight="800"
                        color="primary.700"
                      >
                        ‹
                      </Text>
                    }
                    variant="ghost"
                    size="xs"
                    minW="24px"
                    h="24px"
                    borderRadius="full"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => navigateWeek("prev")}
                  />
                  <Text
                    fontSize="sm"
                    color="primary.700"
                    minW="80px"
                    textAlign="center"
                    fontWeight="800"
                    px={2}
                  >
                    {getCurrentWeekRange(currentDate)}
                  </Text>
                  <IconButton
                    aria-label="Next week"
                    icon={
                      <Text
                        fontSize="14px"
                        fontWeight="800"
                        color="primary.700"
                      >
                        ›
                      </Text>
                    }
                    variant="ghost"
                    size="xs"
                    minW="24px"
                    h="24px"
                    borderRadius="full"
                    _hover={{ bg: "gray.100" }}
                    onClick={() => navigateWeek("next")}
                  />
                </Flex>
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
                <Text textStyle="web.b1" fontWeight={700} color="inherit">
                  {participantData.marillac_bucks} M-Bucks
                </Text>
                <EditIcon fontSize="small" />
              </Button>
            </Flex>

            {/* Second Header: View Toggle and Assign Task Button */}
            <Flex justify="space-between" align="center" mb={6}>
              <HStack spacing={0}>
                <Button
                  variant={
                    currentView === ScheduleView.LIST ? "solid" : "outline"
                  }
                  colorScheme="orange"
                  bg={
                    currentView === ScheduleView.LIST
                      ? "orange.500"
                      : "transparent"
                  }
                  color={
                    currentView === ScheduleView.LIST ? "white" : "orange.500"
                  }
                  borderRightRadius="0"
                  borderRight="0"
                  onClick={() => setCurrentView(ScheduleView.LIST)}
                  leftIcon={
                    <ListIcon
                      color={
                        currentView === ScheduleView.LIST ? "white" : "#E67D4F"
                      }
                    />
                  }
                  _hover={{
                    bg:
                      currentView === ScheduleView.LIST
                        ? "orange.600"
                        : "orange.50",
                  }}
                >
                  List
                </Button>
                <Button
                  variant={
                    currentView === ScheduleView.CALENDAR ? "solid" : "outline"
                  }
                  colorScheme="orange"
                  bg={
                    currentView === ScheduleView.CALENDAR
                      ? "orange.500"
                      : "transparent"
                  }
                  color={
                    currentView === ScheduleView.CALENDAR
                      ? "white"
                      : "orange.500"
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
                  _hover={{
                    bg:
                      currentView === ScheduleView.CALENDAR
                        ? "orange.600"
                        : "orange.50",
                  }}
                >
                  Calendar
                </Button>
              </HStack>

              <Button
                leftIcon={<AddIcon />}
                colorScheme="orange"
                variant="solid"
              >
                Assign Task
              </Button>
            </Flex>

            {/* Content based on current view */}
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              id="list-and-calendar-container"
              minH={0}
            >
              {currentView === ScheduleView.LIST ? (
                <ScheduleListView
                  participantData={participantData}
                  currentDate={currentDate}
                  selectedDay={selectedDay}
                  onDayChange={handleDayChange}
                  onTaskSelect={handleTaskSelect}
                />
              ) : (
                <ScheduleCalendar
                  events={regularEvents}
                  allDayEvents={allDayEvents}
                  currentDate={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={handleTaskSelect}
                  scrollToTime={moment().hour(8).minute(0).toDate()}
                />
              )}
            </Box>
          </>
        )}
      </Flex>

      {/* Modals */}
      {editMarillacBucks && participantData && (
        <MarillacBalanceModal
          close={() => setEditMarillacBucks(false)}
          participantId={participantData.participant_id}
          currentBalance={participantData.marillac_bucks}
          roomNumber={participantData.room_number}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => {
            // TODO: Implement task editing functionality
            setSelectedTask(null);
          }}
          onDelete={() => {
            // TODO: Implement task deletion functionality
            setSelectedTask(null);
          }}
        />
      )}
    </Flex>
  );
}
