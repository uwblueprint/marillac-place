import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../../../../gql/mutations";
import EditTaskModal from "./EditTaskModal";

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

  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
        w="100%"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              <Th width="22%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Name
                  </Text>
                </Flex>
              </Th>
              <Th width="22%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Assigned Days
                  </Text>
                </Flex>
              </Th>
              <Th width="22%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Assigned Times
                  </Text>
                </Flex>
              </Th>
              <Th width="22%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Marillac Bucks
                  </Text>
                </Flex>
              </Th>
              <Th width="12%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">
                    Actions
                  </Text>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : error ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4}>
                  <Text textStyle="web.b3" color="#000000" textAlign="center">
                    {error.message}
                  </Text>
                </Td>
              </Tr>
            ) : (
              tasks.map((task: any, index: number) => (
                <Tr
                  key={task.task_id}
                  outline={index % 2 ? "0px solid" : "1px solid"}
                  outlineColor="neutral.300"
                >
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {task.task_name}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {task.recurrence_preference === "PARTICIPANT_PREFERENCE"
                        ? "Participant Preference"
                        : task.recurrence_preference === "DAILY"
                        ? "Daily"
                        : (task.recurrence_preference === "EVERY_SELECTED_DAYS"
                            ? "Every"
                            : "Any") +
                          (task.repeat_days.length === 7
                            ? "day"
                            : (task.recurrence_preference ===
                              "ANY_SELECTED_DAYS"
                                ? " of "
                                : " ") +
                              task.repeat_days
                                .map((day: string) => days[day])
                                .join(", "))}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {task.time_preference === "PARTICIPANT_PREFERENCE"
                        ? "Participant Preference"
                        : task.time_preference === "ANYTIME"
                        ? "Anytime"
                        : formatTime(task.start_time) +
                          " - " +
                          formatTime(task.end_time)}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(task.marillac_bucks_addition)}
                    </Text>
                  </Td>
                  <Td>
                    <Flex
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
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {edit && selected && (
        <EditTaskModal selected={selected} close={() => setEdit(false)} />
      )}
    </>
  );
};

export default TasksTable;
