import { Checkbox, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  DayPreference,
  TimePreference,
  DayOfWeek,
  TaskType,
} from "../../types/enums";
import { DAYS } from "../../constants/days";
import SelectInput from "../inputs/SelectInput";
import GreenOutlineButton from "../buttons/GreenOutlineButton";
import { toTitleCase } from "../../helpers/stringUtils";
import TimeInput from "../inputs/TimeInput";

type DateOptionsProps = {
  showParticipantPreference?: boolean;
  taskType: TaskType;
  setParticipantPreference: (e: boolean) => void;
  setDayPreference: (e: DayPreference | null) => void;
  setDays: (e: DayOfWeek[]) => void;
  setTimePreference: (e: TimePreference | null) => void;
  setStartTime: (e: Date | null) => void;
  setEndTime: (e: Date | null) => void;
  participantPreference: boolean;
  dayPreference?: DayPreference | null;
  days: DayOfWeek[];
  timePreference?: TimePreference | null;
  startTime?: Date | null;
  endTime?: Date | null;
};

export default function DateOptions({
  showParticipantPreference = true,
  taskType,
  setParticipantPreference,
  setDayPreference,
  setDays,
  setTimePreference,
  setStartTime,
  setEndTime,
  participantPreference,
  dayPreference,
  days,
  timePreference,
  startTime,
  endTime,
}: DateOptionsProps) {
  useEffect(() => {
    if (participantPreference) {
      setDayPreference(DayPreference.PARTICIPANT_PREFERENCE);
      setTimePreference(TimePreference.PARTICIPANT_PREFERENCE);
    }
  }, [participantPreference]);

  useEffect(() => {
    if (dayPreference === DayPreference.DAILY) {
      setDays(DAYS);
    } else if (dayPreference === DayPreference.DAY_RANGE) {
      setTimePreference(TimePreference.ANYTIME);
      setStartTime(null);
      setEndTime(null);
      if (!days) return;
      const earliestDay = days[0];
      const latestDay = days[days.length - 1];
      const earliestDayIndex = DAYS.indexOf(earliestDay);
      const latestDayIndex = DAYS.indexOf(latestDay);
      setDays([...DAYS.slice(earliestDayIndex, latestDayIndex + 1)]);
    } else if (
      dayPreference === DayPreference.PARTICIPANT_PREFERENCE ||
      dayPreference === null
    ) {
      setDays([]);
    }
  }, [dayPreference]);

  useEffect(() => {
    if (timePreference !== TimePreference.SPECIFIC) {
      setStartTime(null);
      setEndTime(null);
    }
  }, [timePreference]);

  function handleSelectDay(day: DayOfWeek) {
    if (!dayPreference) return;
    if (days.length === 0) {
      setDays([day]);
    } else if (dayPreference === DayPreference.EVERY_SELECTED_DAYS) {
      if (!days.includes(day)) {
        setDays([...days, day]);
      } else {
        setDays(days.filter((d) => d !== day));
      }
    } else if (dayPreference === DayPreference.DAY_RANGE) {
      if (days.length === 0) {
        setDays([day]);
      } else if (!days.includes(day)) {
        const a = DAYS.indexOf(day);
        const b = DAYS.indexOf(days[0]);
        const c = DAYS.indexOf(days[days.length - 1]);
        if (a < b) {
          setDays([...DAYS.slice(a, b), ...days]);
        } else {
          setDays([...days, ...DAYS.slice(c + 1, a + 1)]);
        }
      } else if (days.length === 1) {
        setDays([]);
      } else {
        setDays([day]);
      }
    }
  }

  return (
    <>
      {taskType !== TaskType.REQUIRED && showParticipantPreference && (
        <Flex alignItems="center" gap="8px" pt="3px">
          <Text textStyle="s2" color="text.dark">
            Participant Preference
          </Text>
          <Checkbox
            isChecked={participantPreference}
            onChange={(e: any) => setParticipantPreference(e.target.checked)}
          />
        </Flex>
      )}

      {!participantPreference && (
        <>
          <SelectInput
            label="Select Days"
            current_value={dayPreference}
            update_action={(opt: DayPreference) => setDayPreference(opt)}
            value_options={{
              Daily: DayPreference.DAILY,
              "Every selected day": DayPreference.EVERY_SELECTED_DAYS,
              "Any selected day": DayPreference.DAY_RANGE,
            }}
          />

          <Flex gap="5px" mb="2px">
            {DAYS.map((day: DayOfWeek, index) => (
              <GreenOutlineButton
                key={index}
                label={toTitleCase(day).slice(0, 3)}
                action={() => handleSelectDay(day as DayOfWeek)}
                is_active={days !== null && days.includes(day as DayOfWeek)}
              />
            ))}
          </Flex>

          {dayPreference !== DayPreference.DAY_RANGE && (
            <SelectInput
              label="Time"
              current_value={timePreference}
              update_action={(opt: TimePreference) => {
                if (opt === TimePreference.ANYTIME) {
                  setStartTime(null);
                  setEndTime(null);
                }
                setTimePreference(opt);
              }}
              value_options={{
                Anytime: TimePreference.ANYTIME,
                "Select Time": TimePreference.SPECIFIC,
              }}
            />
          )}

          {timePreference === TimePreference.SPECIFIC && (
            <Flex alignItems="center" gap="8px">
              <TimeInput
                size="medium"
                label="Start Time"
                current_value={startTime}
                update_action={setStartTime}
              />
              <TimeInput
                size="medium"
                label="End Time"
                current_value={endTime}
                update_action={setEndTime}
              />
            </Flex>
          )}
        </>
      )}
    </>
  );
}
