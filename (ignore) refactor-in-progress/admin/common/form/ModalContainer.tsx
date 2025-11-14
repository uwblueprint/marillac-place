// Refactor in progress - ignore for now
// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   Flex,
//   Text,
// } from "@chakra-ui/react";
// import { ModalProps } from "../../../../types";
// import SimpleButton from "../buttons/SimpleButton";
// import OrangeButton from "../buttons/OrangeButton";
//
// export default function ModalContainer({
//   title,
//   submit_text,
//   submit_action,
//   cancel_action,
//   children,
//   error = "",
// }: ModalProps) {
//   return (
//     <Modal
//       isOpen
//       isCentered
//       onClose={cancel_action}
//       closeOnOverlayClick={false}
//     >
//       <ModalOverlay />
//       <ModalContent
//         width="fit-content"
//         minWidth="350px"
//         maxWidth="550px"
//         height="fit-content"
//         boxShadow="xl"
//         borderRadius="16px"
//         paddingX="35px"
//         paddingY="25px"
//       >
//         <Text textStyle="web.h3" mb="10px">
//           {title}
//         </Text>
//         <Flex flexDir="column" gap="8px">
//           {children}
//           {error && (
//             <Text textStyle="web.s1" color="#E30000">
//               {error}
//             </Text>
//           )}
//         </Flex>
//         <Flex
//           alignItems="center"
//           justifyContent="flex-end"
//           gap="12px"
//           mt="15px"
//         >
//           <SimpleButton
//             text="Cancel"
//             action={cancel_action}
//             is_active={false}
//             text_color="#000000"
//           />
//           <OrangeButton
//             text={submit_text}
//             action={submit_action}
//             is_active={false}
//           />
//         </Flex>
//       </ModalContent>
//     </Modal>
//   );
// }
