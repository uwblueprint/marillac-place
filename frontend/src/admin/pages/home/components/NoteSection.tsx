export {};
// TODO: Refactor this component
// import {
//   Button,
//   Flex,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Text,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import SendIcon from "@mui/icons-material/Send";
// import { CREATE_NOTE, DELETE_NOTE } from "../../../../gql/mutations";
// import { GET_NOTES } from "../../../../gql/queries";
// 
// const NoteSection = () => {
//   const [newNote, setNewNote] = useState("");
// 
//   const [createNote] = useMutation(CREATE_NOTE);
//   const [deleteNote] = useMutation(DELETE_NOTE);
//   const {
//     loading: getNotesLoading,
//     error: getNotesError,
//     data: getNotesData,
//   } = useQuery(GET_NOTES);
// 
//   async function sendNote() {
//     if (newNote === "") {
//       return;
//     }
//     try {
//       await createNote({
//         variables: {
//           message: newNote,
//         },
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   }
// 
//   async function dismissNote(noteId: string) {
//     try {
//       await deleteNote({
//         variables: {
//           note_id: noteId,
//         },
//       });
//       window.location.reload();
//     } catch (err) {
//       console.log(err);
//     }
//   }
// 
//   return (
//     <Flex
//       position="absolute"
//       right={0}
//       top={0}
//       height="100%"
//       paddingY="15px"
//       paddingX="20px"
//       w="300px"
//       border="1px solid"
//       borderColor="background.border"
//       borderRadius="8px"
//       flexDir="column"
//     >
//       <Flex
//         height="calc(100% - 50px)"
//         flexDir="column"
//         justifyContent="flex-start"
//         gap="10px"
//       >
//         <Flex
//           w="100%"
//           flexDir="row"
//           justifyContent="space-between"
//           alignItems="center"
//           px="2px"
//         >
//           <Text textStyle="web.h3" color="brand.teal">
//             Internal Notes
//           </Text>
//           <Text textStyle="web.b3" color="text.grey" mt="5px">
//             Expires in 48h
//           </Text>
//         </Flex>
//         <Flex
//           alignItems="center"
//           overflow="scroll"
//           height="100%"
//           justifyContent="center"
//           sx={{
//             "&::-webkit-scrollbar": {
//               display: "none",
//             },
//           }}
//         >
//           {getNotesLoading ? (
//             <Text textStyle="web.b2" color="text.grey">
//               Loading...
//             </Text>
//           ) : getNotesError ? (
//             <Text textStyle="web.b2" color="text.grey">
//               {getNotesError.message}
//             </Text>
//           ) : getNotesData.getNotes.length === 0 ? (
//             <Text textStyle="web.b2" color="text.grey">
//               No Admin Notes Yet
//             </Text>
//           ) : (
//             <Flex
//               width="100%"
//               height="100%"
//               flexDir="column"
//               justifyContent="flex-start"
//               gap="10px"
//             >
//               {getNotesData.getNotes.map((note: any) => {
//                 const creation = new Date(
//                   note.creation_date.replace("p.m.", "PM").replace("a.m.", "AM")
//                 )
//                   .toLocaleString("en-ca", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                     month: "short",
//                     day: "numeric",
//                   })
//                   .replace("p.m.", "PM")
//                   .replace("a.m.", "AM");
// 
//                 return (
//                   <Flex
//                     key={note.note_id}
//                     flexDir="column"
//                     width="100%"
//                     bg="neutral.100"
//                     border="1px solid"
//                     borderColor="background.border"
//                     rounded="8px"
//                     paddingX="12px"
//                     paddingY="7px"
//                     gap="5px"
//                   >
//                     <Flex width="100%" flexWrap="wrap" overflow="hidden">
//                       <Text textStyle="web.b2" color="#000000">
//                         {note.message}
//                       </Text>
//                     </Flex>
//                     <Flex
//                       width="100%"
//                       justifyContent="space-between"
//                       alignItems="flex-end"
//                     >
//                       <Text textStyle="web.b3" color="text.grey">
//                         {creation}
//                       </Text>
//                       <Text
//                         onClick={() => dismissNote(note.note_id)}
//                         _hover={{ textDecoration: "none" }}
//                         textStyle="web.b3"
//                         color="#000000"
//                         textDecoration="underline"
//                         fontWeight={600}
//                         cursor="pointer"
//                       >
//                         Dismiss
//                       </Text>
//                     </Flex>
//                   </Flex>
//                 );
//               })}
//             </Flex>
//           )}
//         </Flex>
//       </Flex>
//       <Flex height="50px" alignItems="flex-end">
//         <InputGroup>
//           <Input
//             textStyle="web.b3"
//             color="text.grey"
//             variant="primary"
//             placeholder="Write a note"
//             type="text"
//             value={newNote}
//             onChange={(e) => setNewNote(e.target.value)}
//             border="1px solid"
//             borderColor="background.border"
//           />
// 
//           <InputRightElement>
//             <Button
//               onClick={() => sendNote()}
//               bg="transparent"
//               padding="0px"
//               _hover={{ bg: "transparent" }}
//             >
//               <SendIcon fontSize="small" style={{ color: "#0C727E" }} />
//             </Button>
//           </InputRightElement>
//         </InputGroup>
//       </Flex>
//     </Flex>
//   );
// };
// 
// export default NoteSection;
