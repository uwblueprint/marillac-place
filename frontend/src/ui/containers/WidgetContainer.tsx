import React from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

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
    <Box
      width={width}
      height={height}
      paddingX={paddingX}
      paddingY={paddingY}
      bg={bg_color}
      border="1px solid"
      borderColor="neutral.300"
      rounded="8px"
    >
      {loading ? (
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="md" color="primary.700" />
        </Flex>
      ) : error !== "" ? (
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          gap="2px"
        >
          <Text textStyle="web.error" textAlign="center">
            ERROR
          </Text>
          <Text textStyle="web.b2" color="text.grey" textAlign="center">
            {error}
          </Text>
        </Flex>
      ) : (
        children
      )}
    </Box>
  );
}
