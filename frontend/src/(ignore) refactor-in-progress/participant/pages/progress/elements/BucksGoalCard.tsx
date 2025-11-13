// TODO: Refactor in progress - ignore for now
// import React from "react";
// import {
//   Text,
//   Card,
//   CardHeader,
//   CardBody,
//   Progress,
//   Image,
//   Flex,
//   Button,
//   Box,
// } from "@chakra-ui/react";
//
// type BucksGoalCardProps = {
//   value: number;
//   goal: number | null;
//   onEditGoalClick?: () => void;
// };
//
// export default function BucksGoalCard({
//   value,
//   goal,
//   onEditGoalClick,
// }: BucksGoalCardProps) {
//   const metGoal = value >= (goal ?? -1);
//   const goalExists = !!goal;
//
//   const editGoalText = () => {
//     if (!goalExists) return "Set Goal";
//     if (!metGoal) return "Change Goal";
//     return "Set another";
//   };
//
//   return (
//     <Card m="15px" borderRadius="md">
//       <CardHeader pb="10px">
//         <Flex direction="row" justifyContent="space-between">
//           <Text fontWeight="bold">Marillac Bucks Goal</Text>
//           <Button variant="link" onClick={onEditGoalClick}>
//             {editGoalText()}
//           </Button>
//         </Flex>
//       </CardHeader>
//       <CardBody pt="0">
//         {goalExists ? (
//           metGoal ? (
//             <Flex direction="row" gap={4}>
//               <Image
//                 src="/assets/goal_trophy.png"
//                 alt="$"
//                 width="40px"
//                 height="40px"
//               />
//               <Text>
//                 Congratulations on completing your goal. Make sure to tell
//                 Marillac staff about your achievement.
//               </Text>
//             </Flex>
//           ) : (
//             <Flex direction="column" gap={2}>
//               <Progress
//                 value={(value / goal) * 100}
//                 borderRadius="full"
//                 height="15px"
//               />
//               <Flex
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="start"
//               >
//                 <Text fontWeight="bold" color="gray.500">
//                   $0
//                 </Text>
//                 {value / goal > 0.25 && (
//                   <Flex
//                     direction="column"
//                     position="absolute"
//                     left={`${(value / goal) * 100}%`}
//                     transform="translateX(-50%)"
//                     align="center"
//                     pb="10px"
//                   >
//                     <Box
//                       as="svg"
//                       viewBox="0 0 13 11"
//                       boxSize="15px"
//                       fill="blue.500"
//                     >
//                       <path d="M5.49153 0.535249C5.87459 -0.140713 6.84849 -0.140712 7.23155 0.535249L11.8907 8.75697C12.2685 9.42361 11.787 10.25 11.0207 10.25L1.70236 10.25C0.936125 10.25 0.45457 9.4236 0.832346 8.75697L5.49153 0.535249Z" />
//                     </Box>
//                     <Text fontWeight="bold">${value}</Text>
//                   </Flex>
//                 )}
//                 <Text fontWeight="bold" color="gray.500">
//                   ${goal}
//                 </Text>
//               </Flex>
//             </Flex>
//           )
//         ) : (
//           <Text>Set a new goal to track your progress!</Text>
//         )}
//       </CardBody>
//     </Card>
//   );
// }
