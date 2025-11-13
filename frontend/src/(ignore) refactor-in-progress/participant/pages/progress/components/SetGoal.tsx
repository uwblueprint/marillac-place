// TODO: Refactor in progress - ignore for now
// import { Flex, Image, Input, Text } from "@chakra-ui/react";
// import React, { useState, useContext } from "react";
// import { useMutation } from "@apollo/client";
// import ModalContainer from "../../../../refactor-in-progress/admin/common/form/ModalContainer";
// import { ParticipantContext } from "../../../../../participants/ParticipantContext";
// import { SET_MARILLAC_BUCKS_GOAL } from "../../../../gql/mutations";
//
// interface SetGoalProps {
//   handleClose: () => void;
//   onGoalSet: () => void;
// }
//
// export const SetGoal: React.FC<SetGoalProps> = ({ handleClose, onGoalSet }) => {
//   const [goal, setGoal] = useState("");
//   const [error, setError] = useState("");
//   const participantContext = useContext(ParticipantContext);
//
//   const [setGoalMutation] = useMutation(SET_MARILLAC_BUCKS_GOAL);
//
//   const handleSave = async () => {
//     console.log("🎯 SetGoal: Starting save process");
//     console.log("📝 Goal value entered:", goal);
//     console.log("👤 Participant context:", participantContext);
//
//     if (!participantContext) {
//       console.error("❌ No participant context found");
//       setError("Not logged in");
//       return;
//     }
//
//     const goalValue = parseInt(goal, 10);
//     console.log("🔢 Parsed goal value:", goalValue);
//
//     if (Number.isNaN(goalValue) || goalValue <= 0) {
//       console.error("❌ Invalid goal value");
//       setError("Goal must be greater than 0");
//       return;
//     }
//
//     console.log("✅ Calling mutation with:", {
//       participant_id: participantContext.id,
//       goal_value: goalValue,
//     });
//
//     try {
//       const result = await setGoalMutation({
//         variables: {
//           participant_id: participantContext.id,
//           goal_value: goalValue,
//         },
//       });
//
//       console.log("✅ Mutation success:", result);
//       console.log("🎯 Goal saved successfully!");
//       console.log(
//         `✅ GOAL SAVED: ${goalValue} Marillac Bucks for participant ${participantContext.id}`
//       );
//
//       onGoalSet();
//       handleClose();
//     } catch (err: any) {
//       console.error("❌ Error saving goal:", err);
//       console.error("📋 Error details:", JSON.stringify(err, null, 2));
//       setError(err.message || "Failed to save goal — please try again.");
//     }
//   };
//
//   return (
//     <ModalContainer
//       title="Set a Goal"
//       submit_text="Save"
//       submit_action={async () => {
//         await handleSave();
//       }}
//       cancel_action={handleClose}
//       error={error}
//     >
//       <Flex justify="space-between">
//         <Text textStyle="web.b1">New goal:</Text>
//         <Flex align="center" justify="space-between">
//           <Image src="/assets/marillac_bucks.png" alt="coin" />
//           <Input
//             ml="10px"
//             size="sm"
//             minWidth="32px"
//             maxWidth="80px"
//             height="32px"
//             fontWeight="semibold"
//             type="number"
//             placeholder="0"
//             value={goal}
//             onFocus={(e) => {
//               e.target.select();
//             }}
//             onChange={(e) => {
//               setGoal(e.target.value);
//             }}
//           />
//         </Flex>
//       </Flex>
//     </ModalContainer>
//   );
// };
