import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type WidgetContainerProps = {
  bg_color?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  paddingX?: string;
  paddingY?: string;
};

export default function WidgetContainer({ 
  bg_color = "white", 
  children, 
  width = "fit-content",
  height = "fit-content",
  paddingX = "12px",
  paddingY = "6px",
}: WidgetContainerProps) {
  return (
    <Flex
      flexDir="column"
      width={width}
      height={height}
      bg={bg_color}
      border="1px solid"
      borderColor="neutral.300"
      rounded="8px"
      paddingX={paddingX}
      paddingY={paddingY}
      gap="4px"
      flexWrap="wrap"
      overflow="hidden"
      position="relative"
    >
      {children}
    </Flex>
  );
}