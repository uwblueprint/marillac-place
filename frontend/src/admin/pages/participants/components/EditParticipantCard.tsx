export {};
// TODO: Refactor this component
// import { Flex, FormControl, Input, Text, Button } from "@chakra-ui/react";
// import { useMutation } from "@apollo/client";
// import React, { useState } from "react";
// import { ROOM_NUMBERS } from "../../../../constants/misc";
// import { UPDATE_PARTICIPANT } from "../../../../gql/mutations";
// import ModalContainer from "../../../common/form/ModalContainer";
// import CoreInput from "../../../common/form/CoreInput";
// import GreenButton from "../../../common/buttons/GreenButton";
// 
// type EditParticipantCardProps = {
//   roomNumber: number;
//   participants: Record<number, any>;
//   close: () => void;
// };
// 
// export default function EditParticipantCard({
//   roomNumber,
//   participants,
//   close,
// }: EditParticipantCardProps) {
//   const id: number = participants[roomNumber].participant_id;
//   const today = new Date().toLocaleDateString("en-ca");
//   const currentArrivalDate = participants[roomNumber].arrival_date;
//   const currentPassword = participants[roomNumber].password;
// 
//   const [arrivalDate, setArrivalDate] = useState(currentArrivalDate);
//   const [password, setPassword] = useState(currentPassword);
//   const [departureDate, setDepartureDate] = useState("");
// 
//   const [swapParticipant, setSwapParticipant] = useState(false);
//   const [endStay, setEndStay] = useState(false);
// 
//   const [error, setError] = useState("");
//   const [selectedSwap, setSelectedSwap] = useState(-1);
// 
//   const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);
// 
//   async function handleSubmit() {
//     setError("");
//     if (
//       !arrivalDate ||
//       !password ||
//       (endStay && !departureDate) ||
//       (swapParticipant && selectedSwap === -1)
//     ) {
//       setError("Missing fields");
//     } else if (swapParticipant && selectedSwap === roomNumber) {
//       setError("Invalid swap.");
//     } else if (
//       arrivalDate === currentArrivalDate &&
//       password === currentPassword &&
//       departureDate === "" &&
//       !swapParticipant &&
//       !endStay
//     ) {
//       setError("No changes made");
//     } else if (departureDate && arrivalDate >= departureDate) {
//       setError("Arrival date must be less than departure date");
//     } else {
//       console.log(arrivalDate);
//       if (arrivalDate > today) {
//         setError("Arrival is in the future");
//       } else if (departureDate && departureDate > today) {
//         setError("Departure is in the future");
//       } else {
//         try {
//           await updateParticipant({
//             variables: {
//               participant_id: id,
//               room_number: swapParticipant ? selectedSwap : undefined,
//               arrival_date: arrivalDate,
//               departure_date: endStay ? departureDate : undefined,
//               account_removal_date: endStay ? today : undefined,
//               password,
//             },
//           });
// 
//           if (swapParticipant && selectedSwap in participants) {
//             await updateParticipant({
//               variables: {
//                 participant_id: participants[selectedSwap].participant_id,
//                 room_number: roomNumber,
//               },
//             });
//           }
// 
//           if (swapParticipant) {
//             let message =
//               "Participant #" + id + " moved to Room " + selectedSwap;
//             if (selectedSwap in participants) {
//               message +=
//                 ", Participant #" +
//                 participants[selectedSwap].participant_id +
//                 " moved to Room " +
//                 roomNumber;
//             }
//             localStorage.setItem("notification", message);
//           } else if (endStay) {
//             localStorage.setItem(
//               "notification",
//               "Participant #" + id + " removed from Room " + roomNumber
//             );
//           } else {
//             localStorage.setItem(
//               "notification",
//               "Participant #" + id + " updated"
//             );
//           }
//           window.location.reload();
//         } catch (err: any) {
//           setError(err.message);
//         }
//       }
//     }
//   }
// 
//   return (
//     <ModalContainer
//       title={"Edit Participant in Room " + roomNumber}
//       submit_text="Save Changes"
//       submit_action={handleSubmit}
//       cancel_action={close}
//       error={error}
//     >
//       <FormControl>
//         <Text textStyle="web.s1" color="text.light.secondary">
//           ID Number
//         </Text>
//         <Input
//           disabled
//           type="number"
//           value={id}
//           width="100%"
//           height="fit-content"
//           paddingX="12px"
//           paddingY="6px"
//           border="1px"
//           borderColor="#C5C8D8"
//           borderRadius="8px"
//           fontFamily="Nunito"
//           fontWeight="400"
//           fontSize="12px"
//           color="#000000"
//         />
//       </FormControl>
// 
//       <CoreInput
//         label="Arrival Date"
//         current_value={arrivalDate}
//         action={(e: any) => setArrivalDate(e.target.value)}
//         type="date"
//         width="400px"
//       />
// 
//       <CoreInput
//         label="Password"
//         current_value={password}
//         action={(e: any) => setPassword(e.target.value)}
//         type="password"
//         width="400px"
//       />
// 
//       <Flex alignItems="center" justifyContent="flex-start" gap="8px">
//         <GreenButton
//           text="Swap Participant"
//           action={() => {
//             setEndStay(false);
//             setDepartureDate("");
//             setError("");
//             setSwapParticipant(true);
//           }}
//           is_active={swapParticipant}
//         />
//         <Button
//           onClick={() => {
//             setSwapParticipant(false);
//             setSelectedSwap(-1);
//             setError("");
//             setEndStay(true);
//           }}
//           isActive={endStay}
//           cursor="pointer"
//           borderRadius="8px"
//           border="1px"
//           borderColor="#E30000"
//           width="fit-content"
//           height="fit-content"
//           paddingX="12px"
//           paddingY="6px"
//           bg="#FFFFFF"
//           color="#E30000"
//           _hover={{
//             color: "#FFFFFF",
//             bg: "#E30000",
//           }}
//           _active={{
//             color: "#FFFFFF",
//             bg: "#E30000",
//           }}
//         >
//           <Text textStyle="web.s1" color="inherit">
//             End Stay
//           </Text>
//         </Button>
//       </Flex>
// 
//       {(endStay || swapParticipant) && (
//         <Flex w="100%" h="1px" bg="neutral.300" mt="8px" />
//       )}
// 
//       {swapParticipant && (
//         <Flex flexDir="column">
//           <Text textStyle="web.s1" color="text.light.secondary" mb="3px">
//             Available Rooms
//           </Text>
//           <Flex wrap="wrap" gap="5px" width="400px">
//             {ROOM_NUMBERS.map((num: number) => (
//               <GreenButton
//                 key={num}
//                 text={"Room " + num}
//                 action={() => setSelectedSwap(num)}
//                 is_active={selectedSwap === num}
//               />
//             ))}
//           </Flex>
//         </Flex>
//       )}
// 
//       {selectedSwap !== -1 &&
//         (selectedSwap === roomNumber ? (
//           <Text textStyle="web.b3">
//             Participant #{participants[roomNumber].participant_id} is already in
//             Room {roomNumber}.
//           </Text>
//         ) : (
//           <Flex flexDir="column" gap="5px">
//             <Text textStyle="web.b3">
//               Participant #{participants[roomNumber].participant_id} will be
//               moved to Room {selectedSwap}.
//             </Text>
//             {selectedSwap in participants && (
//               <Text textStyle="web.b3">
//                 Participant #{participants[selectedSwap].participant_id} will be
//                 moved to Room {roomNumber}.
//               </Text>
//             )}
//           </Flex>
//         ))}
// 
//       {endStay && (
//         <CoreInput
//           label="Departure Date"
//           current_value={departureDate}
//           action={(e: any) => setDepartureDate(e.target.value)}
//           type="date"
//           width="400px"
//         />
//       )}
//     </ModalContainer>
//   );
// }
