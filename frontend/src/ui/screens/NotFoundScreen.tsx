import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_HOME_PAGE,
  PARTICIPANTS_HOME_PAGE,
} from "../../constants/routes";
import GreenOutlineButton from "../buttons/GreenOutlineButton";

export default function NotFoundScreen() {
  const navigate = useNavigate();

  function handleClick() {
    const path = window.location.pathname.split("/");
    if (path.length >= 2 && path[1] === "admin") {
      navigate(ADMIN_HOME_PAGE);
    } else {
      navigate(PARTICIPANTS_HOME_PAGE);
    }
  }

  return (
    <Flex w="100%" h="100vh" alignItems="center" justifyContent="center">
      <Flex
        width="350px"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        gap="20px"
        padding="20px"
      >
        <img src="/assets/logo.png" alt="Marillac Place Logo" width="50%" />
        <Text textStyle="h2" color="brand.secondaryDark" textAlign="center">
          404 Page Not Found
        </Text>
        <Text textStyle="b1" color="text.black" textAlign="center">
          Sorry! The page you are looking for does not exist. If you think
          something is broken, please contact support via our{" "}
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
          label="Return to Home"
          action={() => handleClick()}
          is_active={false}
        />
      </Flex>
    </Flex>
  );
}
