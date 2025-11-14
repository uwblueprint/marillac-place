// Refactor in progress - ignore for now
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Tabs, TabList, Tab, Box, Flex, Text } from "@chakra-ui/react";
// import * as ROUTES from "../../../../constants/routes";
// import SimpleButton from "../buttons/SimpleButton";
// import ModalContainer from "../form/ModalContainer";
//
// type SideBarTabProps = {
//   label: string;
//   handleClick: () => void;
// };
//
// function SideBarTab({ label, handleClick }: SideBarTabProps) {
//   return (
//     <Tab
//       mb="12px"
//       width="100%"
//       padding="8px 16px"
//       borderRadius="8px"
//       justifyContent="left"
//       fontWeight={500}
//       fontSize="16px"
//       fontFamily="Nunito"
//       color="#000000"
//       onClick={handleClick}
//       _selected={{
//         fontWeight: 700,
//         color: "background.white",
//         bg: "brand.orange",
//       }}
//     >
//       {label}
//     </Tab>
//   );
// }
//
// type SignOutPopUpProps = {
//   cancel: () => void;
// };
//
// function SignOutPopUp({ cancel }: SignOutPopUpProps) {
//   const navigate = useNavigate();
//   const handleSignOut = () => {
//     localStorage.removeItem("admin_token");
//     return navigate(ROUTES.ADMIN_LOGIN_PAGE);
//   };
//
//   return (
//     <ModalContainer
//       title="Sign Out"
//       submit_text="Sign Out"
//       submit_action={handleSignOut}
//       cancel_action={cancel}
//     >
//       <Text textStyle="web.b2" color="text.light.secondary">
//         Are you sure you want to sign out?
//       </Text>
//     </ModalContainer>
//   );
// }
//
// export default function SideBar() {
//   const navigate = useNavigate();
//   const [signOut, setSignOut] = useState(false);
//
//   const pages = [
//     { label: "Home", route: ROUTES.ADMIN_HOME_PAGE },
//     { label: "Schedule", route: ROUTES.ADMIN_SCHEDULE_PAGE },
//     { label: "Announcements", route: ROUTES.ADMIN_ANNOUNCEMENTS_PAGE },
//     { label: "Participants", route: ROUTES.ADMIN_PARTICIPANTS_PAGE },
//     { label: "Task Library", route: ROUTES.ADMIN_TASKS_PAGE },
//     { label: "Badge Library", route: ROUTES.ADMIN_BADGES_PAGE },
//     { label: "Reports", route: ROUTES.ADMIN_REPORTS_PAGE },
//   ];
//
//   const currentPage = pages.findIndex(
//     (page) => page.route === window.location.pathname
//   );
//
//   return (
//     <Box
//       w="250px"
//       h="100vh"
//       position="absolute"
//       top={0}
//       left={0}
//       borderRight="1px"
//       borderRightColor="background.border"
//       bg="background.white"
//       padding="25px 20px"
//       display="flex"
//       flexDirection="column"
//       justifyContent="space-between"
//       alignItems="left"
//     >
//       <Flex width="100%" flexDir="column" gap="40px" alignItems="left">
//         <img src="/assets/logo.png" alt="Marillac Place Logo" width="85%" />
//
//         <Tabs
//           index={currentPage}
//           orientation="vertical"
//           variant="unstyled"
//           width="100%"
//         >
//           <TabList w="100%">
//             {pages.map((page) => (
//               <SideBarTab
//                 key={page.label}
//                 label={page.label}
//                 handleClick={() => navigate(page.route)}
//               />
//             ))}
//           </TabList>
//         </Tabs>
//       </Flex>
//
//       <SimpleButton
//         text="Sign Out"
//         action={() => setSignOut(true)}
//         is_active={signOut}
//         text_color="indicate.signOut900"
//       />
//
//       {signOut && <SignOutPopUp cancel={() => setSignOut(false)} />}
//     </Box>
//   );
// }
