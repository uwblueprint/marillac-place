import React from "react";
import { Flex, Spinner, Text } from "@chakra-ui/react";

type WidgetContainerProps = {
  bg_color?: string;
  children: React.ReactNode;
  width?: string;
  height?: string;
  paddingX?: string;
  paddingY?: string;
  loading?: boolean;
  error?: string;
};

export default function WidgetContainer({ 
  bg_color = "white", 
  children, 
  width = "fit-content",
  height = "fit-content",
  paddingX = "12px",
  paddingY = "6px",
  loading = false,
  error = "",
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
      {loading ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Spinner size="md" color="primary.700" />
        </Flex>
      ): error !== "" ? (
        <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
          <Text textStyle="web.b2" color="text.light.secondary">Error: {error}</Text>
        </Flex>
      ): (
        children
      )}
    </Flex>
  );
}