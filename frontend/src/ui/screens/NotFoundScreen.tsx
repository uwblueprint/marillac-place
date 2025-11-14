import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

// TODO: verify this screen is for properly formatted on mobile and web + add contact support information
export default function NotFound() {
  const navigate = useNavigate();

  function handleClick() {
    const path = window.location.pathname.split("/");
    if (path.length >= 2 && path[1] === "admin") {
      navigate(ROUTES.ADMIN_LOGIN_PAGE);
    } else {
      navigate(ROUTES.PARTICIPANTS_LOGIN_PAGE);
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
        <Text textStyle="web.h2" color="brand.orange" textAlign="center">
          404 Page Not Found
        </Text>
        <Text textStyle="web.b2" color="text.light.primary" textAlign="center">
          Sorry! The page you are looking for does not exist. If you think
          something is broken, please report a problem.
        </Text>
        <Button
          variant="primaryOutline"
          borderRadius="full"
          onClick={() => handleClick()}
        >
          Return to Login
        </Button>
      </Flex>
    </Flex>
  );
}
