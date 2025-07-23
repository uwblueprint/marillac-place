import { Flex, Text } from "@chakra-ui/react";

interface ProgressBarProps {
  startValue: number;
  currentValue: number;
  endValue: number;
}
export default function ProgressBar({
  startValue,
  currentValue,
  endValue,
}: ProgressBarProps) {
  const progress = currentValue / endValue;
  return (
    <Flex flexDir="column" width="100%">
      <Flex height="50px" width="100%">
        <Flex
          position="absolute"
          left="0"
          backgroundColor="primary.700"
          width={progress}
        />
        <Flex
          position="absolute"
          left="0"
          width="100%"
          backgroundColor="primary.100"
        />
      </Flex>
      <Flex flexDir="row" width="100%">
        <Text left="0" textStyle="mobile.h3" color="text.light.secondary">
          ${startValue}
        </Text>
        <Flex flexDir="column">
          <Text textStyle="mobile.h3" color="text.light.primary">
            ${currentValue}
          </Text>
        </Flex>
        <Text right="0" textStyle="mobile.h3" color="text.light.secondary">
          ${endValue}
        </Text>
      </Flex>
    </Flex>
  );
}
