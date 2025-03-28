import { ColumnInfoTypes } from "../../common/CommonTable";

export const tasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Task Name",
    key: "name",
  },
  {
    header: "Recurrence",
    key: "repeatDaysString",
  },
  {
    header: "End Date",
    key: "end",
  },
  {
    header: "Marillac Bucks",
    key: "creditString",
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
