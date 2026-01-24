import { Flex, Text, Box } from "@chakra-ui/react";
import React from "react";
import GreenOutlineButton from "../buttons/GreenOutlineButton";

type ErrorScreenProps = {
  message?: string;
};

function handleClick() {
  window.location.reload();
}

export default function ErrorScreen({
  message = "An error has occured, please try again later.",
}: ErrorScreenProps) {
  return (
    <Flex
      w="100%"
      h="100%"
      alignItems="center"
      justifyContent="center"
      role="alert"
    >
      <Box
        width={["90%", "420px"]}
        bg="white"
        borderRadius="12px"
        p={6}
        textAlign="center"
      >
        <Box
          fontSize="32px"
          lineHeight="1"
          mb={3}
          role="img"
          aria-label="error"
        >
          ⚠️
        </Box>

        <Text fontSize="14px" color="text.medium" mb={2} fontWeight={500}>
          Oops — something went wrong
        </Text>

        <Text fontSize="18px" color="brand.secondaryDark" mb={2} fontWeight={700}>
          {message}
        </Text>

        <Text fontSize="12px" color="text.medium" mb={4}>
          If the problem persists, contact support via our{" "}
          <a
            href="https://marillacplace.ca/contact/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "brand.primaryDark", textDecoration: "underline" }}
          >
            contact page
          </a>
          .
        </Text>

        <GreenOutlineButton
          label="Reload"
          action={() => handleClick()}
          is_active={false}
        />
      </Box>
    </Flex>
  );
}
