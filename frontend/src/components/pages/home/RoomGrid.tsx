// import React, { useEffect, useState } from "react";
// import { Flex, Grid } from "@chakra-ui/react";
// import { useQuery } from "@apollo/client";
// import RoomCard from "./HomeRoomCard";
// import { TaskType } from "../../../types/TaskTypes";


// import { GET_TASKS_BY_ASSIGNEE_ID } from "../../../APIClients/Queries/TaskQueries";
// import { GET_ALL_RESIDENTS } from "../../../APIClients/Queries/ResidentsQueries";

// const {
//   // loading: residentAllLoading, MAY NEED TO ADD LOADING ICON/STATE
//   // error: residentAllError,
//   data: residentAllData,
// } = useQuery(GET_ALL_RESIDENTS);

// useEffect(() => {
//   if (residentAllData?.getAllResidents) {
//     console.log(residentAllData.getAllResidents);
//   }
// }, [residentAllData]);

// function RoomGrid() {
//   const { data: rooms, error: roomError, loading: roomLoading } = useQuery(GET_ALL_RESIDENTS);
//   if (roomError) {
//     return <div>Error</div>;
//   }

//   return roomLoading ? <div>load</div> : (
//     <Flex justifyContent="center" alignItems="center" width="100%">
//       <Grid
//         templateColumns={{
//           md: "repeat(2, 1fr)",
//           lg: "repeat(3, 1fr)",
//           xl: "repeat(4, 1fr)",
//         }}
//         gap="20px"
//         width="100%"
//       >
//         {rooms.map((room: { roomNumber: string; residentId: number; userId: string }) => (
//           <RoomCard room={room.roomNumber} residentId={room.residentId} key={room.userId} pendingTasks={1} assignedTasks={1} />
//         ))}
//       </Grid>
//     </Flex>
//   );
// }

// export default RoomGrid;

// import React, { useEffect, useState } from "react";
// import { Flex, Grid } from "@chakra-ui/react";
// import { useQuery } from "@apollo/client";
// import RoomCard from "./HomeRoomCard";
// import { GET_TASKS_BY_ASSIGNEE_ID } from "../../../APIClients/Queries/TaskQueries";
// import { GET_ALL_RESIDENTS } from "../../../APIClients/Queries/ResidentsQueries";
// import { TaskType } from "../../../types/TaskTypes";

// function RoomGrid() {
//   // Fetch all residents data
//   const { data: residentData, error: residentError, loading: residentLoading } = useQuery(GET_ALL_RESIDENTS);
  
//   // Local state for storing task counts
//   const [taskCounts, setTaskCounts] = useState<{ [key: number]: { assignedTasks: number; pendingTasks: number } }>({});

//   const useFetchTasksForResident = (assigneeId: number) => {
//     const { data, loading, error } = useQuery(GET_TASKS_BY_ASSIGNEE_ID, {
//       variables: { assigneeId },
//       skip: !assigneeId,  // Skip if no assigneeId
//     });
  
//     // Handle loading and error states
//     if (loading) return { assignedTasks: 0, pendingTasks: 0, loading: true };
//     if (error) return { assignedTasks: 0, pendingTasks: 0, error: error.message };
  
//     // Return the task count data (you can expand this logic as needed)
//     const assignedTasks = data?.getTasksByAssigneeId?.length || 0;
//     const pendingTasks = 0; // Placeholder for pending tasks logic
  
//     return { assignedTasks, pendingTasks, loading: false, error: null };
//   };

//   // UseEffect to fetch tasks for all residents
//   useEffect(() => {
//     if (residentData?.getAllResidents) {
//       const fetchAllTasks = async () => {
//         const counts: { [key: number]: { assignedTasks: number; pendingTasks: number } } = {};

//         // We use Promise.all to fetch tasks for all residents concurrently
//         const taskPromises = residentData.getAllResidents.map(async (resident: { userId: number }) => {
//           const { userId } = resident;
//           const taskData = useFetchTasksForResident(userId);
//           counts[userId] = taskData;
//         });

//         // Wait for all tasks to be fetched and then update state
//         await Promise.all(taskPromises);

//         // Set the state with the results
//         setTaskCounts(counts);
//       };

//       fetchAllTasks();
//     }
//   }, [residentData]);

//   return (
//     <Flex justifyContent="center" alignItems="center" width="100%">
//       <Grid
//         templateColumns={{
//           md: "repeat(2, 1fr)",
//           lg: "repeat(3, 1fr)",
//           xl: "repeat(4, 1fr)",
//         }}
//         gap="20px"
//         width="100%"
//       >
//         {residentData.getAllResidents.map((room: { roomNumber: string; residentId: number; userId: number }) => {
//           const taskData = taskCounts[room.userId] || { assignedTasks: 0, pendingTasks: 0 };

//           return (
//             <RoomCard
//               key={room.userId}
//               room={room.roomNumber}
//               residentId={room.residentId}
//               assignedTasks={taskData.assignedTasks}
//               pendingTasks={taskData.pendingTasks}
//             />
//           );
//         })}
//       </Grid>
//     </Flex>
//   );
// }

// export default RoomGrid;


import React, { useEffect, useState } from "react";
import { Flex, Grid } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import RoomCard from "./HomeRoomCard";
import { GET_ALL_RESIDENTS } from "../../../APIClients/Queries/ResidentsQueries";
import { GET_TASKS_BY_ASSIGNEE_ID } from "../../../APIClients/Queries/TaskQueries";

const RoomGrid = () => {
  // Fetch all residents data
  const { data: residentData, error: residentError, loading: residentLoading } = useQuery(GET_ALL_RESIDENTS);

  // Local state for storing task counts and loading states
  const [taskCounts, setTaskCounts] = useState<{ [key: number]: { assignedTasks: number; pendingTasks: number } }>({});

    const useFetchTasksForResident = (assigneeId: number) => {
    const { data, loading, error } = useQuery(GET_TASKS_BY_ASSIGNEE_ID, {
      variables: { assigneeId },
      skip: !assigneeId,  // Skip if no assigneeId
    });
  
    // Handle loading and error states
    if (loading) return { assignedTasks: 0, pendingTasks: 0, loading: true };
    if (error) return { assignedTasks: 0, pendingTasks: 0, error: error.message };
  
    // Return the task count data (you can expand this logic as needed)
    const assignedTasks = data?.getTasksByAssigneeId?.filter((task) => task.status === Status.PENDING_APPROVAL).length || 0;
    const pendingTasks = 0; // Placeholder for pending tasks logic
  
    return { assignedTasks, pendingTasks, loading: false, error: null };
  };

  // Fetch task counts for all residents
  useEffect(() => {
    if (residentData?.getAllResidents) {
      const newTaskCounts: { [key: number]: { assignedTasks: number; pendingTasks: number } } = {};
      let tasksFetched = 0;
      let totalResidents = residentData.getAllResidents.length;

      // We can map over residents and use the hook directly for each one
      residentData.getAllResidents.forEach((resident: { userId: number }) => {
        const { assignedTasks, pendingTasks, loading, error } = useFetchTasksForResident(resident.userId);

        // Check if data is loading
        if (loading) {
          newTaskCounts[resident.userId] = { assignedTasks: 0, pendingTasks: 0 }; // Default placeholder
        } else if (error) {
          newTaskCounts[resident.userId] = { assignedTasks: 0, pendingTasks: 0 }; // Handle error
        } else {
          newTaskCounts[resident.userId] = { assignedTasks, pendingTasks }; // Set fetched task data
        }

        tasksFetched++;

        // Once all residents' tasks are fetched, set the task counts
        if (tasksFetched === totalResidents) {
          setTaskCounts(newTaskCounts);
        }
      });
    }
  }, [residentData]); // Trigger effect when residentData changes

  return (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <Grid
        templateColumns={{
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap="20px"
        width="100%"
      >
        {residentData?.getAllResidents?.map((room: { roomNumber: string; residentId: number; userId: number }) => {
          const taskData = taskCounts[room.userId] || { assignedTasks: 0, pendingTasks: 0 };

          return (
            <RoomCard
              key={room.userId}
              room={room.roomNumber}
              residentId={room.residentId}
              assignedTasks={taskData.assignedTasks}
              pendingTasks={taskData.pendingTasks}
            />
          );
        })}
      </Grid>
    </Flex>
  );
};

export default RoomGrid;
