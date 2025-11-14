// Refactor in progress - ignore for now
// import React from "react";
// import { FormControl, Input, Text } from "@chakra-ui/react";
// import { InputProps } from "../../../../types";
//
// type CoreInputProps = InputProps & {
//   type: "text" | "password" | "date" | "time" | "number";
//   width?: string;
// };
//
// export default function CoreInput({
//   label,
//   current_value,
//   action,
//   type,
//   width = "450px",
// }: CoreInputProps) {
//   return (
//     <FormControl>
//       <Text textStyle="web.s1" color="text.light.secondary">
//         {label}
//       </Text>
//       <Input
//         type={type}
//         value={current_value}
//         onChange={action}
//         width={width}
//         height="fit-content"
//         paddingX="12px"
//         paddingY="6px"
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
//       />
//     </FormControl>
//   );
// }
