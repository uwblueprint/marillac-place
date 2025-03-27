import React from "react";
import { DaysOfWeek } from "../../../types/TaskTypes";
import { ColumnInfoTypes, TableData } from "../../common/CommonTable";
import { Text } from "@chakra-ui/react";

const dayIdMap = [
  { key: DaysOfWeek.MONDAY, short: "Mon" },
  { key: DaysOfWeek.TUESDAY, short: "Tue" },
  { key: DaysOfWeek.WEDNESDAY, short: "Wed" },
  { key: DaysOfWeek.THURSDAY, short: "Thu" },
  { key: DaysOfWeek.FRIDAY, short: "Fri" },
  { key: DaysOfWeek.SATURDAY, short: "Sat" },
  { key: DaysOfWeek.SUNDAY, short: "Sun" },
];

const getDayShortNames = (days: DaysOfWeek[]): string[] => {
  return days.map((day) => {
    const dayMapping = dayIdMap.find((d) => d.key === day);
    return dayMapping ? dayMapping.short : "";
  });
};

export const tasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Assigned Days",
    key: "repeatDays",
    // render: (row: TableData) => {
    //   const repeatDays = row.repeatDays as DaysOfWeek[];
    //   const dayNames = getDayShortNames(repeatDays);
    //   return <Text>{dayNames.join(", ")}</Text>;
    // },
  },
  {
    header: "Assigned Time",
    key: "start",
  },
  {
    header: "Marillac Bucks",
    key: "credit",
  },
];

export const choreTasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Chore Name",
    key: "name",
  },
  {
    header: "Recurrence",
    key: "isRecurring",
  },
  {
    header: "Due Date",
    key: "end",
  },
  {
    header: "Marillac Bucks",
    key: "credit",
  },
];
