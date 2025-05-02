import React from "react";
import { Flex, Text} from "@chakra-ui/react";
import CheckmarkSvg from "../../svg/CheckmarkSvg";

type NotificationProps = {
  message: string
}

export default function Notification({ message }: NotificationProps) {
  return (
    <Flex
      position="absolute"
      top="25px"
      left="50%"
      transform="translateX(-50%)"
      border="3px solid"
      borderRadius="8px"
      borderColor="success.800"
      zIndex="1000"
      paddingY="12px"
      paddingX="20px"
      justifyContent="center"
      alignItems="center"
      gap="10px"
      boxShadow="lg"
      bg="success.100"
    >
      <CheckmarkSvg />
      <Text color="success.900" textStyle="web.b1" fontWeight="700">
        { message }
      </Text>
    </Flex>
  )
};