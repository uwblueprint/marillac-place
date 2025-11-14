// Refactor in progress - ignore for now
// import { Flex, FormControl, Input, Text } from "@chakra-ui/react";
// import { useMutation } from "@apollo/client";
// import React, { useState } from "react";
// import { UPDATE_PARTICIPANT } from "../../../../gql/mutations";
// import ModalContainer from "../../../common/form/ModalContainer";
// import CoreInput from "../../../common/form/CoreInput";
//
// type EditPastParticipantCardProps = {
//   id: number;
//   arrival: string;
//   departure: string;
//   close: () => void;
// };
//
// export default function EditPastParticipantCard({
//   id,
//   arrival,
//   departure,
//   close,
// }: EditPastParticipantCardProps) {
//   const [arrivalDate, setArrivalDate] = useState(arrival);
//   const [departureDate, setDepartureDate] = useState(departure);
//
//   const [error, setError] = useState("");
//
//   const [updateParticipant] = useMutation(UPDATE_PARTICIPANT);
//
//   async function handleSubmit() {
//     setError("");
//     if (!arrivalDate || !departureDate) {
//       setError("Missing fields");
//     } else if (arrivalDate === arrival && departureDate === departure) {
//       setError("No changes made");
//     } else if (departureDate && arrivalDate >= departureDate) {
//       setError("Arrival date must be less than departure date");
//     } else {
//       const today = new Date().toLocaleDateString("en-ca");
//       if (arrivalDate > today) {
//         setError("Arrival is in the future");
//       } else if (departureDate && departureDate > today) {
//         setError("Departure is in the future");
//       } else {
//         try {
//           await updateParticipant({
//             variables: {
//               participant_id: id,
//               arrival_date: arrivalDate,
//               departure_date: departureDate,
//             },
//           });
//           localStorage.setItem(
//             "notification",
//             "Participant #" + id + " updated"
//           );
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
//       title="Edit Past Participant"
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
//           width="350px"
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
//       <Flex gap="8px">
//         <CoreInput
//           label="Arrival Date"
//           current_value={arrivalDate}
//           action={(e: any) => setArrivalDate(e.target.value)}
//           type="date"
//           width="100%"
//         />
//         <CoreInput
//           label="Departure Date"
//           current_value={departureDate}
//           action={(e: any) => setDepartureDate(e.target.value)}
//           type="date"
//           width="100%"
//         />
//       </Flex>
//     </ModalContainer>
//   );
// }
