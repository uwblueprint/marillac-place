export {};
// TODO: Refactor this component
// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { Button, Flex, Text, Input, FormControl } from "@chakra-ui/react";
// import { useMutation } from "@apollo/client";
// import { isParticipant } from "../../../utils/checkRole";
// import { PARTICIPANT_LOGIN } from "../../../gql/mutations";
// import * as ROUTES from "../../../constants/routes";
// import Loading from "../../../Loading";
// 
// export default function ParticipantsLoginPage() {
//   const navigate = useNavigate();
// 
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [checkLoggedIn, setCheckLoggedIn] = useState(false);
// 
//   const [id, setId] = useState("");
//   const [password, setPassword] = useState("");
// 
//   const [error, setError] = useState("");
// 
//   const [login, { loading }] = useMutation(PARTICIPANT_LOGIN, {
//     onCompleted: (data) => {
//       localStorage.setItem("participant_token", data.participantLogin.token);
//       navigate(ROUTES.PARTICIPANTS_HOME_PAGE);
//     },
//     onError: (err: Error) => {
//       // Check if it's a network error (CORS, connection refused, etc.)
//       if (
//         err.message.includes("Failed to fetch") ||
//         err.message.includes("NetworkError") ||
//         err.message.includes("Network request failed")
//       ) {
//         setError(
//           "Unable to connect to server. Please check your internet connection and try again."
//         );
//       } else {
//         // Show the actual error message from the backend
//         setError(err.message);
//       }
//     },
//   });
// 
//   useEffect(() => {
//     const tokenCheck = async () => {
//       const participantUser = await isParticipant();
//       if (participantUser) {
//         setLoggedIn(true);
//       }
//       setCheckLoggedIn(true);
//     };
//     tokenCheck();
//   }, []);
// 
//   const handleSubmit = () => {
//     setError("");
// 
//     if (!id || !password) {
//       setError("Missing fields");
//     } else {
//       login({ variables: { id: Number(id), password } });
//     }
//   };
// 
//   if (!checkLoggedIn || loading) {
//     return <Loading />;
//   }
// 
//   if (loggedIn) {
//     return <Navigate to={ROUTES.PARTICIPANTS_HOME_PAGE} replace />;
//   }
// 
//   return (
//     <Flex
//       w="100vw"
//       h="100vh"
//       alignItems="flex-start"
//       justifyContent="center"
//       bg="background.header"
//     >
//       <Flex
//         width="350px"
//         flexDir="column"
//         alignItems="center"
//         justifyContent="center"
//         gap="45px"
//         padding="35px 15px"
//       >
//         <Flex width="75%">
//           <img width="100%" src="/assets/logo.png" alt="Marillac Place Logo" />
//         </Flex>
//         <Flex
//           width="100%"
//           flexDir="column"
//           gap="15px"
//           bg="background.white"
//           padding="25px 15px"
//           borderRadius="8px"
//           border="1px"
//           borderColor="background.border"
//         >
//           <Flex flexDir="column">
//             <Text textStyle="mobile.h1">Sign in</Text>
// 
//             <Text textStyle="mobile.b1">
//               Please enter your login information.
//             </Text>
//           </Flex>
// 
//           <FormControl>
//             <Input
//               variant="primary"
//               type="id"
//               value={id}
//               onChange={(e) => setId(e.target.value)}
//               placeholder="ID #"
//             />
//           </FormControl>
// 
//           <FormControl>
//             <Input
//               variant="primary"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//             />
//           </FormControl>
// 
//           {error && (
//             <Text textStyle="mobile.b2" fontWeight="600" color="#E30000">
//               {error}
//             </Text>
//           )}
// 
//           <Button
//             width="full"
//             variant="primaryFilled"
//             borderRadius="full"
//             fontWeight="700"
//             fontSize="16px"
//             onClick={handleSubmit}
//             isLoading={loading}
//           >
//             Sign in
//           </Button>
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// }
