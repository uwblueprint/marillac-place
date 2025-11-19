export {};
// TODO: Refactor this component
// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import {
//   Select,
//   Button,
//   Flex,
//   Text,
//   Input,
//   FormControl,
// } from "@chakra-ui/react";
// import { ADMIN_LOGIN } from "../../../gql/mutations";
// import { isAdmin, isRelief } from "../../../utils/checkRole";
// import * as ROUTES from "../../../constants/routes";
// // import Loading from "../../../Loading";
// 
// export default function AdminLoginPage() {
//   const navigate = useNavigate();
// 
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [checkLoggedIn, setCheckLoggedIn] = useState(false);
// 
//   const [role, setRole] = useState("");
//   const [password, setPassword] = useState("");
// 
//   const [error, setError] = useState("");
// 
//   const [login, { loading }] = useMutation(ADMIN_LOGIN, {
//     onCompleted: (data) => {
//       localStorage.setItem("admin_token", data.adminLogin.token);
//       navigate(ROUTES.ADMIN_HOME_PAGE);
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
//       const adminUser = await isAdmin();
//       const reliefUser = await isRelief();
//       if (adminUser || reliefUser) {
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
//     if (!role || !password) {
//       setError("Missing fields");
//     } else {
//       login({ variables: { role, password } });
//     }
//   };
// 
//   // if (!checkLoggedIn || loading) {
//   //   return <Loading />;
//   // }
// 
//   if (loggedIn) {
//     return <Navigate to={ROUTES.ADMIN_HOME_PAGE} replace />;
//   }
// 
//   return (
//     <Flex
//       w="100vw"
//       h="100vh"
//       alignItems="center"
//       justifyContent="center"
//       bg="background.white"
//     >
//       <Flex
//         width="900px"
//         h="450px"
//         bg="background.header"
//         borderRadius="8px"
//         boxShadow="lg"
//         flexDir="row"
//         alignItems="center"
//         justifyContent="space-around"
//       >
//         <Flex width="30%" marginLeft="3vw">
//           <img width="100%" src="/assets/logo.png" alt="Marillac Place Logo" />
//         </Flex>
// 
//         <Flex
//           width="400px"
//           p="40px"
//           borderRadius="8px"
//           border="1px"
//           borderColor="background.border"
//           bg="background.white"
//           flexDir="column"
//           alignItems="left"
//           justifyContent="center"
//           gap="20px"
//         >
//           <Flex flexDir="column">
//             <Text textStyle="web.h1">Sign in</Text>
// 
//             <Text textStyle="web.b1">Please enter your login information.</Text>
//           </Flex>
// 
//           <Flex flexDir="column" gap="10px">
//             <FormControl>
//               <Select
//                 variant="primary"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 placeholder="Role"
//               >
//                 <option value="admin">Administrative Staff</option>
//                 <option value="relief">Relief Staff</option>
//               </Select>
//             </FormControl>
// 
//             <FormControl>
//               <Input
//                 variant="primary"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//               />
//             </FormControl>
// 
//             {error && (
//               <Text textStyle="web.error">
//                 {error}
//               </Text>
//             )}
//           </Flex>
// 
//           <Button
//             width="100%"
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
