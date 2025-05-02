export {}
// import React from "react";
// import {
//   Button,
//   Input,
//   HStack,
//   InputLeftElement,
//   InputGroup,
//   Flex,
// } from "@chakra-ui/react";
// import colors from "../../theme/colors";
// import FormInputField from "../../common/FormInputField";
//
// interface Props {
//   value: number;
//   setValue: (value: number) => void;
// }
//
// export default function NumberInput({ value, setValue }: Props) {
//   const increment = () => setValue(value + 1);
//   const decrement = () => setValue(value - 1);
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = parseFloat(e.target.value);
//     if (!Number.isNaN(newValue)) {
//       setValue(newValue);
//     }
//   };
//
//   return (
//     <Flex flexDir="row" w="200px" gap="5px">
//       <Button
//         style={{
//           border: `1px solid ${colors.primary[700]}`,
//           backgroundColor: "transparent",
//           padding: "0px",
//           color: colors.primary[700],
//         }}
//         onClick={decrement}
//       >
//         -
//       </Button>
//       <FormInputField
//         label=""
//         leftElement="$"
//         type="number"
//         value={value}
//         onChange={handleChange}
//       />
//       <Button
//         style={{
//           border: `1px solid ${colors.primary[700]}`,
//           backgroundColor: "transparent",
//           padding: "0px",
//           color: colors.primary[700],
//         }}
//         onClick={increment}
//       >
//         +
//       </Button>
//     </Flex>
//   );
// }
