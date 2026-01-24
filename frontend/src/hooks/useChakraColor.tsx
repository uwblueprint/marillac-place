import { useToken } from "@chakra-ui/react";

const useChakraColor = (color: string) => {
  const [resolvedColor] = useToken("colors", [color]);
  return resolvedColor ?? color;
};

export default useChakraColor;
