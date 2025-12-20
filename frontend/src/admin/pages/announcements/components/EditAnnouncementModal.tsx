export {};
// TODO: Refactor this component
// import React, { useState } from "react";
// import { Text, Flex } from "@chakra-ui/react";
// import { useMutation } from "@apollo/client";
// import { EDIT_ANNOUNCEMENT } from "../../../../gql/mutations";
// import ModalContainer from "../../../common/form/ModalContainer";
// import SelectionInput from "../../../common/form/SelectionInput";
// import TextInput from "../../../common/form/TextInput";
//
// type EditAnnouncementModalProps = {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   announcementId: number;
//   sendTo: string;
//   initialMessage: string;
//   initialPriority: string;
// };
//
// const EditAnnouncementModal = ({
//   isOpen,
//   setIsOpen,
//   announcementId,
//   sendTo,
//   initialMessage,
//   initialPriority,
// }: EditAnnouncementModalProps): React.ReactElement => {
//   const [priority, setPriority] = useState(initialPriority);
//   const [message, setMessage] = useState(initialMessage);
//
//   const [error, setError] = useState("");
//
//   const [editAnnouncement] = useMutation(EDIT_ANNOUNCEMENT);
//
//   const handleSave = async () => {
//     setError("");
//     if (!announcementId || !priority || !message.trim()) {
//       setError("Missing fields");
//       return;
//     }
//
//     try {
//       await editAnnouncement({
//         variables: {
//           announcement_id: announcementId,
//           priority,
//           message,
//         },
//       });
//
//       localStorage.setItem("notification", "Announcement updated!");
//
//       setIsOpen(false);
//       window.location.reload();
//     } catch (err: any) {
//       console.error("Edit error:", err);
//       console.error("GraphQL error details:", err.graphQLErrors);
//       console.error("Network error details:", err.networkError);
//       setError("Unable to update announcement");
//     }
//   };
//
//   const handleCancel = () => {
//     setError("");
//     setIsOpen(false);
//   };
//
//   return (
//     <ModalContainer
//       title="Edit Announcement"
//       submit_text="Save Changes"
//       submit_action={handleSave}
//       cancel_action={handleCancel}
//       error={error}
//     >
//       <Flex gap="5px" align="flex-end">
//         <Text textStyle="web.s1" color="text.light.secondary">
//           Sent To
//         </Text>
//         <Text textStyle="web.b3" color="#000000">
//           {sendTo}
//         </Text>
//       </Flex>
//
//       <SelectionInput
//         label="Priority Level"
//         current_value={priority}
//         action={(opt: string) => setPriority(opt)}
//         mode="radio"
//         value_options={{
//           Normal: "NORMAL",
//           High: "HIGH",
//           Critical: "CRITICAL",
//         }}
//       />
//
//       <TextInput
//         label="Message"
//         current_value={message}
//         action={(e: any) => setMessage(e.target.value)}
//         width="350px"
//       />
//     </ModalContainer>
//   );
// };
//
// export default EditAnnouncementModal;
