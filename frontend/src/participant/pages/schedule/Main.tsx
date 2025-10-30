import React, { useState, useRef } from "react";
import { Flex, Text, Spinner, Box, HStack, Button } from "@chakra-ui/react";
import moment from "moment";
import {
  ListIcon,
  CalendarIcon,
} from "../../../admin/pages/schedule/components/CustomIcons";
import ScheduleCalendar from "../../../admin/pages/schedule/components/ScheduleCalendar";
import ParticipantListView from "./elements/ListView";
import ParticipantTaskDetailsModal from "./elements/TaskDetailsModal";
import { useScheduleData } from "../../../admin/pages/schedule/components/useScheduleData";
import {
  CalendarEvent,
  ScheduleView,
} from "../../../admin/pages/schedule/components/ScheduleTypes";
import "../../../admin/pages/schedule/components/ScheduleCalendar.css";
import colors from "../../../theme/colors";

export default function ParticipantsSchedulePage() {
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<ScheduleView>(
    ScheduleView.CALENDAR
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  // Touch swipe refs for week navigation (mobile)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef<boolean>(false);

  const isMobileWidth = () =>
    typeof window !== "undefined" && window.innerWidth <= 768;

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "prev" | "next" | null
  >(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [animationStage, setAnimationStage] = useState<
    "idle" | "out" | "in-start" | "in-run"
  >("idle");

  const startAnimatedNavigate = (direction: "prev" | "next") => {
    if (isAnimating) return;
    const target = moment(currentDate)
      .add(direction === "next" ? 1 : -1, "week")
      .toDate();
    setTargetDate(target);
    setAnimationDirection(direction);
    setIsAnimating(true);
    setAnimationStage("out");
  };

  // TODO this uses placeholder data for now, we need to change this to get actual data from backend
  const selectedRoom = 1;

  const { loading, error, participantData, regularEvents, allDayEvents } =
    useScheduleData(selectedRoom, currentDate);

  const handleTaskSelect = (event: CalendarEvent) => {
    setSelectedTask(event);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobileWidth()) return;
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobileWidth()) return;
    if (touchStartXRef.current === null || touchStartYRef.current === null)
      return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartXRef.current;
    const dy = touch.clientY - touchStartYRef.current;
    // Is the swipe horizontal?
    if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobileWidth()) return;
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (startX === null || startY === null) return;
    if (!isSwipingRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    // Require a clear horizontal swipe with sufficient distance
    const horizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50;
    if (!horizontal) return;
    if (dx < 0) {
      // Swipe left → next week
      startAnimatedNavigate("next");
    } else {
      // Swipe right → previous week
      startAnimatedNavigate("prev");
    }
    isSwipingRef.current = false;
  };

  const handleTransitionEnd = () => {
    if (!isAnimating) return;
    if (animationStage === "out") {
      // Swap content to target week, set initial position for fade-in
      if (targetDate) {
        setCurrentDate(targetDate);
      }
      setAnimationStage("in-start");
      // Next frame, start the fade-in/slide-in
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setAnimationStage("in-run"));
      });
      return;
    }
    if (animationStage === "in-run") {
      // Finish animation
      setIsAnimating(false);
      setAnimationDirection(null);
      setTargetDate(null);
      setAnimationStage("idle");
    }
  };

  const renderScheduleContent = (dateForView: Date) => {
    return currentView === ScheduleView.LIST ? (
      <ParticipantListView
        regularEvents={regularEvents}
        allDayEvents={allDayEvents}
        currentDate={dateForView}
        onTaskSelect={handleTaskSelect}
      />
    ) : (
      <ScheduleCalendar
        events={regularEvents}
        allDayEvents={allDayEvents}
        currentDate={dateForView}
        onNavigate={setCurrentDate}
        onSelectEvent={handleTaskSelect}
        scrollToTime={moment().hour(8).minute(0).toDate()}
        isParticipant
      />
    );
  };

  return (
    <>
      <Flex direction="column" h="100%" w="100%">
        {/* Main Content */}
        <Box w="100%" flex={1} display="flex" flexDirection="column" bg="white">
          {loading ? (
            <Flex justify="center" align="center" h="400px">
              <Spinner size="xl" />
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center" h="400px">
              <Text color="red.500">An error occurred</Text>
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
                No schedule data available
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" flex={1} minH={0} px="20px" pt="20px">
              {/* Top Header: Month and View Toggle */}
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="20px" fontWeight="bold" color="primary.700">
                  {moment(currentDate).format("MMMM YYYY")}
                </Text>

                <HStack spacing={0}>
                  <Button
                    variant={
                      currentView === ScheduleView.LIST ? "solid" : "outline"
                    }
                    colorScheme="orange"
                    bg={
                      currentView === ScheduleView.LIST
                        ? colors.secondary[700]
                        : "transparent"
                    }
                    color={
                      currentView === ScheduleView.LIST
                        ? "white"
                        : colors.secondary[700]
                    }
                    borderRadius="8px"
                    border="1px solid"
                    borderColor={colors.neutral[300]}
                    borderRightRadius="0"
                    borderRight="0"
                    p="8px"
                    iconSpacing={0}
                    minW="unset"
                    w="26px"
                    h="26px"
                    onClick={() => setCurrentView(ScheduleView.LIST)}
                    leftIcon={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <ListIcon
                          size={10}
                          color={
                            currentView === ScheduleView.LIST
                              ? "white"
                              : colors.secondary[700]
                          }
                        />
                      </Box>
                    }
                    _hover={{
                      bg:
                        currentView === ScheduleView.LIST
                          ? colors.secondary[700]
                          : colors.secondary[100],
                    }}
                  />
                  <Button
                    variant={
                      currentView === ScheduleView.CALENDAR
                        ? "solid"
                        : "outline"
                    }
                    colorScheme="orange"
                    bg={
                      currentView === ScheduleView.CALENDAR
                        ? colors.secondary[700]
                        : "transparent"
                    }
                    color={
                      currentView === ScheduleView.CALENDAR
                        ? "white"
                        : colors.secondary[700]
                    }
                    borderRadius="8px"
                    border="1px solid"
                    borderColor={colors.neutral[300]}
                    borderLeftRadius="0"
                    borderLeft="0"
                    p="8px"
                    iconSpacing={0}
                    minW="unset"
                    w="26px"
                    h="26px"
                    onClick={() => setCurrentView(ScheduleView.CALENDAR)}
                    leftIcon={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <CalendarIcon
                          size={10}
                          color={
                            currentView === ScheduleView.CALENDAR
                              ? "white"
                              : colors.secondary[700]
                          }
                        />
                      </Box>
                    }
                    _hover={{
                      bg:
                        currentView === ScheduleView.CALENDAR
                          ? colors.secondary[700]
                          : colors.secondary[100],
                    }}
                  />
                </HStack>
              </Flex>

              {/* Content based on current view */}
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                id="list-and-calendar-container"
                minH={0}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: "pan-y" }}
              >
                <div
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    opacity:
                      animationStage === "idle" || animationStage === "in-run"
                        ? 1
                        : 0,
                    transform:
                      animationStage === "idle"
                        ? "translateX(0px)"
                        : animationStage === "out"
                        ? animationDirection === "next"
                          ? "translateX(-16px)"
                          : "translateX(16px)"
                        : animationStage === "in-start"
                        ? animationDirection === "next"
                          ? "translateX(16px)"
                          : "translateX(-16px)"
                        : "translateX(0px)",
                    transition:
                      animationStage === "out" || animationStage === "in-run"
                        ? "opacity 180ms ease, transform 180ms ease"
                        : "none",
                    willChange: "opacity, transform",
                  }}
                >
                  {renderScheduleContent(currentDate)}
                </div>
              </Box>
            </Flex>
          )}
        </Box>

        {/* Modals */}
        {selectedTask && (
          <ParticipantTaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </Flex>
    </>
  );
}
