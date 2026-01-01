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
  message = "Something went wrong. Please try again later.",
}: ErrorScreenProps) {
  return (
    <Flex
      w="100%"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="neutral.100"
      role="alert"
    >
      <Box
        width={["90%", "420px"]}
        bg="white"
        borderRadius="12px"
        boxShadow="lg"
        p={6}
        textAlign="center"
      >
        <Box mb={4}>
          <img src="/assets/logo.png" alt="Marillac Place Logo" width="64" />
        </Box>

        <Box
          fontSize="28px"
          lineHeight="1"
          mb={2}
          role="img"
          aria-label="error"
        >
          ⚠️
        </Box>

        <Text fontSize="14px" color="gray.500" mb={2} fontWeight={500}>
          Oops — something went wrong
        </Text>

        <Text fontSize="18px" color="secondary.700" mb={4} fontWeight={700}>
          Error: {message}
        </Text>

        <Text fontSize="12px" color="gray.500" mb={4}>
          If the problem persists, contact support via our{" "}
          <a
            href="https://marillacplace.ca/contact/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0C727E", textDecoration: "underline" }}
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
