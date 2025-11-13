// TODO: Refactor in progress - ignore for now
// import React from "react";
// import {
//   FormControl,
//   RadioGroup,
//   Stack,
//   Radio,
//   Text,
//   Select,
// } from "@chakra-ui/react";
// import { InputProps } from "../../../../types";
//
// type SelectionInputProps = InputProps & {
//   mode: "radio" | "dropdown";
//   value_options: Record<string, string>;
// };
//
// export default function SelectionInput({
//   label,
//   current_value,
//   action,
//   mode,
//   value_options,
//   width = "450px",
// }: SelectionInputProps) {
//   if (mode === "radio") {
//     return (
//       <FormControl>
//         <Text textStyle="web.s1" color="text.light.secondary">
//           {label}
//         </Text>
//         <RadioGroup value={current_value} onChange={action}>
//           <Stack direction="column" spacing={0.5}>
//             {Object.entries(value_options).map(([key, value], index) => (
//               <Radio
//                 key={index}
//                 value={value}
//                 size="sm"
//                 border="1px"
//                 borderColor="#0C727E"
//                 _focus={{
//                   boxShadow: "none",
//                 }}
//                 _checked={{
//                   bg: "#0C727E",
//                 }}
//               >
//                 <Text textStyle="web.b3" color="#000000">
//                   {key}
//                 </Text>
//               </Radio>
//             ))}
//           </Stack>
//         </RadioGroup>
//       </FormControl>
//     );
//   }
//
//   return (
//     <FormControl>
//       <Text textStyle="web.s1" color="text.light.secondary">
//         {label}
//       </Text>
//       <Select
//         value={current_value ?? ""}
//         onChange={action}
//         width={width}
//         height="32px"
//         border="1px"
//         borderColor="#C5C8D8"
//         borderRadius="8px"
//         fontFamily="Nunito"
//         fontWeight="400"
//         fontSize="12px"
//         color="#000000"
//         _focus={{
//           borderColor: "#C5C8D8",
//           boxShadow: "none",
//         }}
//       >
//         <option value="">Please Select</option>
//         {Object.entries(value_options).map(([key, value], index) => (
//           <option key={index} value={value}>
//             {key}
//           </option>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }
