import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type WidgetContainerProps = {
  bg_color: string;
  children: React.ReactNode;
  width: string;
};

export default function WidgetContainer({ bg_color, children, width }: WidgetContainerProps) {
  return (
    <Flex
      flexDir="column"
      width={width}
      bg={bg_color}
      border="1px solid"
      borderColor="neutral.300"
      rounded="8px"
      paddingX="12px"
      paddingY="6px"
      gap="4px"
      flexWrap="wrap"
      overflow="hidden"
      position="relative"
    >
      {children}
    </Flex>
  );
}