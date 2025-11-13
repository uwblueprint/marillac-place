// TODO: Refactor in progress - ignore for now
import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import CoreInput from "./CoreInput";
import TextInput from "./TextInput";
import SelectionInput from "./SelectionInput";
import GreenButton from "../buttons/GreenButton";
import { toTitleCase } from "../../../helpers";
import {
  DayOfWeek,
  RecurrenceFrequency,
  TimeOption,
} from "../../../types/task";
import { weekdays } from "../../../../constants/rooms";

type TaskInputProps = {
  set_recurrence: (e: any) => void;
  set_days: (e: any) => void;
  set_time: (e: any) => void;
  set_start_time: (e: any) => void;
  set_end_time: (e: any) => void;
  set_addition: (e: any) => void;
  set_deduction: (e: any) => void;
  set_comments: (e: any) => void;
  recurrence?: RecurrenceFrequency | "";
  days?: DayOfWeek[];
  time?: TimeOption | "";
  start_time?: string;
  end_time?: string;
  addition?: number;
  deduction?: number;
  comments?: string;
};

export default function TaskInput({
  set_recurrence,
  set_days,
  set_time,
  set_start_time,
  set_end_time,
  set_addition,
  set_deduction,
  set_comments,
  recurrence = "",
  days = [],
  time = "",
  start_time = "",
  end_time = "",
  addition = 0,
  deduction = 0,
  comments = "",
}: TaskInputProps) {
  useEffect(() => {
    if (recurrence === RecurrenceFrequency.DAILY) {
      set_days(weekdays as DayOfWeek[]);
    } else if (recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS) {
      const earliestDay = days[0];
      const latestDay = days[days.length - 1];
      const a = weekdays.indexOf(earliestDay as string);
      const b = weekdays.indexOf(latestDay as string);
      set_days([...weekdays.slice(a, b + 1)]);
    }
  }, [recurrence]);

  function handleSelectDay(day: DayOfWeek) {
    if (recurrence === RecurrenceFrequency.EVERY_SELECTED_DAYS) {
      if (!days.includes(day)) {
        set_days([...days, day]);
      } else {
        set_days(days.filter((d) => d !== day));
      }
    } else if (recurrence === RecurrenceFrequency.ANY_SELECTED_DAYS) {
      if (days.length === 0) {
        set_days([day]);
      } else if (!days.includes(day)) {
        const a = weekdays.indexOf(day as string);
        const b = weekdays.indexOf(days[0] as string);
        const c = weekdays.indexOf(days[days.length - 1] as string);
        if (a < b) {
          set_days([...weekdays.slice(a, b), ...days]);
        } else {
          set_days([...days, ...weekdays.slice(c + 1, a + 1)]);
        }
      } else if (days.length === 1) {
        set_days([]);
      } else {
        set_days([day]);
      }
    }
  }

  return (
    <>
      <SelectionInput
        label="Select Days"
        current_value={recurrence}
        action={(opt: RecurrenceFrequency) => set_recurrence(opt)}
        mode="radio"
        value_options={{
          Daily: RecurrenceFrequency.DAILY,
          "Every selected day": RecurrenceFrequency.EVERY_SELECTED_DAYS,
          "Any selected day": RecurrenceFrequency.ANY_SELECTED_DAYS,
        }}
      />

      <Flex gap="5px">
        {weekdays.map((day: string, index) => (
          <GreenButton
            key={index}
            text={toTitleCase(day).slice(0, 3)}
            action={() => handleSelectDay(day as DayOfWeek)}
            is_active={days.includes(day as DayOfWeek)}
          />
        ))}
      </Flex>

      <SelectionInput
        label="Time"
        current_value={time}
        action={(opt: TimeOption) => {
          if (opt === TimeOption.ANYTIME) {
            set_start_time("");
            set_end_time("");
          }
          set_time(opt);
        }}
        mode="radio"
        value_options={{
          Anytime: TimeOption.ANYTIME,
          "Select Time": TimeOption.SPECIFIC,
        }}
      />

      {time === TimeOption.SPECIFIC && (
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          <CoreInput
            label="Start Time"
            current_value={start_time}
            action={(e: any) => set_start_time(e.target.value)}
            type="time"
            width="90%"
          />
          <CoreInput
            label="End Time"
            current_value={end_time}
            action={(e: any) => set_end_time(e.target.value)}
            type="time"
            width="90%"
          />
        </Flex>
      )}

      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <CoreInput
          label="Marillac Bucks"
          current_value={String(addition)}
          action={(e: any) => set_addition(e.target.value as number)}
          type="number"
          width="50%"
        />
        <CoreInput
          label="Marillac Bucks Deduction"
          current_value={String(deduction)}
          action={(e: any) => set_deduction(e.target.value as number)}
          type="number"
          width="50%"
        />
      </Flex>

      <TextInput
        label="Comments"
        current_value={comments}
        action={(e: any) => set_comments(e.target.value)}
      />
    </>
  );
}
