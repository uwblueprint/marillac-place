import { ColumnInfoTypes } from "../../common/CommonTable";

export const tasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Task Name",
    key: "title",
  },
  {
    header: "Due Date",
    key: "dueDate",
  },
  {
    header: "Marillac Bucks",
    key: "creditValue",
  },
];

export const customTasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Task Name",
    key: "title",
  },
  {
    header: "Room #",
    key: "roomNumber",
  },
  {
    header: "Due Date",
    key: "dueDate",
  },
  {
    header: "Marillac Bucks",
    key: "creditValue",
  },
];

export const choreTasksColumnTypes: ColumnInfoTypes[] = [
  {
    header: "Chore Name",
    key: "title",
  },
  {
    header: "Location",
    key: "location",
  },
  {
    header: "Due Date",
    key: "dueDate",
  },
  {
    header: "Marillac Bucks",
    key: "creditValue",
  },
];
