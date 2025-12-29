import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../../../../gql/taskRequests";
import DataTable, { Row } from "../../../../ui/misc/DataTable";
import { Task } from "../../../../types/models";
import {
  DayPreference,
  DayOfWeek,
  TimePreference,
  TaskType,
} from "../../../../types/enums";
import { DAY_ABBREVIATIONS } from "../../../../constants/days";
import { formatTimeString } from "../../../../helpers/formatDateTime";
import { Marker, Trash } from "../../../../ui/icons/ActionIcons";
import EditTaskModal from "./EditTaskModal";
import { formatCurrency } from "../../../../helpers/formatCurrency";

type TasksTableProps = {
  taskType: TaskType;
  loading: boolean;
  error: any;
  tasks: any[];
  refetch: () => void;
};

const TasksTable = ({
  taskType,
  loading,
  error,
  tasks,
  refetch,
}: TasksTableProps) => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask] = useMutation(DELETE_TASK);

  async function handleDeleteTask(tid: number) {
    try {
      await deleteTask({
        variables: { tid },
      });
    } catch (err: any) {
      console.log(err);
    }
    refetch();
  }

  function getAssignedDaysString(
    dayPreference: DayPreference,
    days: DayOfWeek[]
  ) {
    switch (dayPreference) {
      case DayPreference.DAILY:
        return "Daily";
      case DayPreference.DAY_RANGE:
        return days.map((day: DayOfWeek) => DAY_ABBREVIATIONS[day]).join(" - ");
      case DayPreference.EVERY_SELECTED_DAYS:
        return days.map((day: DayOfWeek) => DAY_ABBREVIATIONS[day]).join(", ");
      default:
        return "Participant Preference";
    }
  }

  function getAssignedTimesString(
    timePreference: TimePreference,
    start_time: string,
    end_time: string
  ) {
    switch (timePreference) {
      case TimePreference.ANYTIME:
        return "Anytime";
      case TimePreference.SPECIFIC:
        return (
          formatTimeString(start_time) + " - " + formatTimeString(end_time)
        );
      default:
        return "Participant Preference";
    }
  }

  const columns = [
    { header: "Name", width: "20%" },
    { header: "Assigned Days", width: "20%" },
    { header: "Assigned Times", width: "20%" },
    { header: "Marillac Bucks", width: "20%" },
    { header: "", width: "10%", center: true },
    { header: "", width: "10%", center: true },
  ];

  const rows =
    tasks.length !== 0
      ? tasks.map((task: any) => {
          return [
            {
              element: task.name,
            },
            {
              element: getAssignedDaysString(task.day_preference, task.days),
            },
            {
              element: getAssignedTimesString(
                task.time_preference,
                task.start_time,
                task.end_time
              ),
            },
            {
              element: formatCurrency(task.value),
            },
            {
              element: <Marker size={20} />,
              action: async () => setEditTask(task),
            },
            {
              element: <Trash size={20} />,
              action: async () => handleDeleteTask(task.tid),
            },
          ];
        })
      : [];

  if (taskType === TaskType.OPTIONAL) {
    rows.push([
      {
        element: "Individual Goal",
      },
      {
        element: "Participant Preference",
      },
      {
        element: "Participant Preference",
      },
      {
        element: formatCurrency(10),
      },
      {
        element: "",
      },
      {
        element: "",
      },
    ]);
  }

  return (
    <>
      <DataTable
        loading={loading}
        error={error}
        columns={columns}
        rows={rows}
      />

      {editTask !== null && (
        <EditTaskModal
          selected={editTask}
          close={() => setEditTask(null)}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default TasksTable;
