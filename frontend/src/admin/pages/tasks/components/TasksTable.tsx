import { Text, Flex } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../../../../gql/mutations";
import EditTaskModal from "./EditTaskModal";
import DataTable from "../../../common/misc/DataTable";

type TasksTableProps = {
  loading: boolean;
  error: any;
  tasks: any[];
};

const TasksTable = ({ loading, error, tasks }: TasksTableProps) => {
  const days: Record<string, string> = {
    MONDAY: "M",
    TUESDAY: "T",
    WEDNESDAY: "W",
    THURSDAY: "Th",
    FRIDAY: "F",
    SATURDAY: "Sa",
    SUNDAY: "Su",
  };

  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [deleteTask] = useMutation(DELETE_TASK);

  function formatTime(t: string) {
    // const [h, m] = t.split(":").map(Number);
    // return `${(h % 12 || 12)}:${m.toString().padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    return t;
  }

  async function handleDeleteTask(id: number) {
    try {
      await deleteTask({
        variables: {
          taskId: id,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
    window.location.reload();
  }

  const columns = [
    { header: "Name", width: "22%" },
    { header: "Assigned Days", width: "22%" },
    { header: "Assigned Times", width: "22%" },
    { header: "Marillac Bucks", width: "22%" },
    { header: "Actions", width: "12%" },
  ];

  const rows: JSX.Element[][] = tasks.length
    ? tasks.map((task: any) => {
        const cells: JSX.Element[] = [
          <Text key={`name-${task.task_id}`} textStyle="web.b3" color="#000000">
            {task.task_name}
          </Text>,
          <Text key={`days-${task.task_id}`} textStyle="web.b3" color="#000000">
            {task.recurrence_preference === "PARTICIPANT_PREFERENCE"
              ? "Participant Preference"
              : task.recurrence_preference === "DAILY"
              ? "Daily"
              : (task.recurrence_preference === "EVERY_SELECTED_DAYS"
                  ? "Every"
                  : "Any") +
                (task.repeat_days.length === 7
                  ? "day"
                  : (task.recurrence_preference === "ANY_SELECTED_DAYS"
                      ? " of "
                      : " ") +
                    task.repeat_days
                      .map((day: string) => days[day])
                      .join(", "))}
          </Text>,
          <Text
            key={`times-${task.task_id}`}
            textStyle="web.b3"
            color="#000000"
          >
            {task.time_preference === "PARTICIPANT_PREFERENCE"
              ? "Participant Preference"
              : task.time_preference === "ANYTIME"
              ? "Anytime"
              : formatTime(task.start_time) + " - " + formatTime(task.end_time)}
          </Text>,
          <Text
            key={`bucks-${task.task_id}`}
            textStyle="web.b3"
            color="#000000"
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(task.marillac_bucks_addition)}
          </Text>,
          <Flex
            key={`actions-${task.task_id}`}
            alignItems="center"
            justifyContent="flex-start"
            gap="15px"
          >
            <Flex
              cursor="pointer"
              onClick={() => {
                setSelected(task);
                setEdit(true);
              }}
            >
              <EditIcon
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#000000",
                  cursor: "pointer",
                }}
              />
            </Flex>
            <Flex
              cursor="pointer"
              onClick={() => handleDeleteTask(task.task_id)}
            >
              <DeleteOutlineIcon
                style={{
                  width: "1.3rem",
                  height: "1.3rem",
                  color: "#D34C5C",
                }}
              />
            </Flex>
          </Flex>,
        ];

        return cells;
      })
    : [];

  const editModal = selected && (
    <EditTaskModal selected={selected} close={() => setEdit(false)} />
  );

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        edit={edit}
        selected={selected}
        error={error}
        editModal={editModal}
      />
    </>
  );
};

export default TasksTable;
