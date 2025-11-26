export {};
// TODO: Refactor this component
// import { Flex, Image, Input, Text } from "@chakra-ui/react";
// import React, { useState, useContext } from "react";
// import { useMutation } from "@apollo/client";
// import ModalContainer from "../../../../admin/common/form/ModalContainer";
// import { ParticipantContext } from "../../../common/ParticipantContext";
// import { UPDATE_MARILLAC_BUCKS_GOAL } from "../../../../gql/mutations";
// 
// interface EditGoalProps {
//   handleClose: () => void;
//   onGoalUpdated: () => void;
//   currentGoal: number;
//   currentBalance: number;
// }
// 
// export const EditGoal: React.FC<EditGoalProps> = ({
//   handleClose,
//   onGoalUpdated,
//   currentGoal,
//   currentBalance,
// }) => {
//   const [goal, setGoal] = useState("");
//   const [error, setError] = useState("");
//   const participantContext = useContext(ParticipantContext);
// 
//   const [updateGoalMutation] = useMutation(UPDATE_MARILLAC_BUCKS_GOAL);
// 
//   const handleSave = async () => {
//     if (!participantContext) {
//       setError("Not logged in");
//       return;
//     }
// 
//     const goalValue = parseInt(goal, 10);
//     if (Number.isNaN(goalValue)) {
//       setError("Please enter a valid number");
//       return;
//     }
// 
//     if (goalValue <= currentBalance) {
//       setError("Goals must be greater than current Marillac Bucks Balance");
//       return;
//     }
// 
//     try {
//       await updateGoalMutation({
//         variables: {
//           participant_id: participantContext.id,
//           new_goal_value: goalValue,
//         },
//       });
// 
//       onGoalUpdated();
//       handleClose();
//     } catch (err: any) {
//       console.error("Error updating goal:", err);
//       setError(err.message || "Failed to update goal — please try again.");
//     }
//   };
// 
//   // Show previous goal value
//   React.useEffect(() => {
//     setGoal(currentGoal.toString());
//   }, [currentGoal]);
// 
//   return (
//     <ModalContainer
//       title="Edit Goal"
//       submit_text="Save"
//       submit_action={async () => {
//         await handleSave();
//       }}
//       cancel_action={handleClose}
//       error={error}
//     >
//       <Flex flexDirection="column" gap="15px">
//         {/* Previous Goal */}
//         <Flex justify="space-between">
//           <Text textStyle="web.b1">Previous goal:</Text>
//           <Flex align="center" justify="space-between">
//             <Image src="/assets/marillac_bucks.png" alt="coin" />
//             <Text ml="10px" fontWeight="semibold">
//               {currentGoal}
//             </Text>
//           </Flex>
//         </Flex>
// 
//         {/* New Goal */}
//         <Flex justify="space-between">
//           <Text textStyle="web.b1">New goal:</Text>
//           <Flex align="center" justify="space-between">
//             <Image src="/assets/marillac_bucks.png" alt="coin" />
//             <Input
//               ml="10px"
//               size="sm"
//               minWidth="32px"
//               maxWidth="80px"
//               height="32px"
//               fontWeight="semibold"
//               type="number"
//               placeholder="0"
//               value={goal}
//               onFocus={(e) => {
//                 e.target.select();
//               }}
//               onChange={(e) => {
//                 setGoal(e.target.value);
//               }}
//             />
//           </Flex>
//         </Flex>
//       </Flex>
//     </ModalContainer>
//   );
// };
