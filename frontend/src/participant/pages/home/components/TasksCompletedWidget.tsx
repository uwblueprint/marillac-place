import React from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { PARTICIPANTS_SCHEDULE_PAGE } from "../../../../constants/routes";

const TrophyIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_6440_5902)">
      <path
        d="M5.12332 5H11.1233C12.2273 5 13.0003 4.896 13.0003 6V4C13.0003 2.896 12.2273 2 11.1233 2H3.12332C1.12332 2 -0.459679 4.125 0.123321 7C0.123321 7 1.91432 16.375 2.04032 16.958C2.37332 18.5 4.16432 20 6.08132 20H13.0393C14.1443 20 13.0003 18.104 13.0003 17V15C13.0003 16.104 12.2273 17 11.1233 17H7.12332C6.01932 17 5.29032 15.958 5.12332 15C4.95632 14.042 3.53932 7.667 3.53932 7.667C3.20632 5.75 4.01832 5 5.12332 5ZM30.9353 5H24.9353C23.8313 5 22.0003 4.896 22.0003 6V4C22.0003 2.896 23.8313 2 24.9353 2H32.9353C34.9353 2 36.5193 4.125 35.9353 7C35.9353 7 34.3023 16.419 34.1643 17C33.8103 18.5 32.1223 20 30.1643 20H23.0183C21.9143 20 22.0003 18.104 22.0003 17V15C22.0003 16.104 23.8313 17 24.9353 17H28.9353C30.0393 17 30.7693 15.958 30.9353 15C31.1013 14.042 32.5193 7.667 32.5193 7.667C32.8513 5.75 32.0403 5 30.9353 5ZM20.8323 22C20.8323 15.042 18.1233 22 18.1233 22C18.1233 22 15.1233 15.042 15.1233 22C15.1233 28.958 11.8323 32 11.8323 32H24.1243C24.1233 32 20.8323 28.958 20.8323 22Z"
        fill="#FFAC33"
      />
      <path
        d="M29.123 6.57747C29.123 13.3525 22.353 24.7695 18.123 24.7695C13.893 24.7695 7.12305 13.3525 7.12305 6.57747C7.12305 1.38247 8.12305 0.25847 10.123 0.25847C11.497 0.25847 16.148 0.23147 18.123 0.23147L25.123 0.23047C28.04 0.22947 29.123 0.91447 29.123 6.57747Z"
        fill="#FFD983"
      />
      <path
        d="M27 33C27 34.104 27.227 35 26.123 35H10.123C9.018 35 9 34.104 9 33V32C9 30.896 10.164 30 11.206 30H25.123C26.165 30 27 30.896 27 32V33Z"
        fill="#F4900C"
      />
      <path
        d="M29 34.625C29 35.385 29.165 36 27.748 36H8.498C7.206 36 7 35.385 7 34.625V34.375C7 33.615 7.738 33 8.498 33H27.748C28.507 33 29 33.615 29 34.375V34.625Z"
        fill="#F4900C"
      />
      <path
        d="M2.61604 32.4261L2.77615 31.9242L2.49939 31.476L3.00125 31.6361L3.44947 31.3593L3.28937 31.8612L3.56613 32.3094L3.06427 32.1493L2.61604 32.4261Z"
        fill="#E6A98E"
        fillOpacity="0.75"
      />
      <path
        d="M30.8093 29.2145L30.8616 28.6169L30.3095 28.3826L30.8939 28.2476L30.9462 27.6501L31.2552 28.1642L31.8396 28.0293L31.4461 28.482L31.755 28.9962L31.2029 28.7618L30.8093 29.2145Z"
        fill="#4597A1"
        fillOpacity="0.65"
      />
      <circle
        cx="0.26405"
        cy="27.6361"
        r="0.26405"
        fill="#E67D4F"
        fillOpacity="0.65"
      />
      <path
        d="M3.19438 29.4078L3.135 29.0011L2.78762 28.7814L3.19431 28.722L3.41397 28.3747L3.47335 28.7814L3.82074 29.001L3.41404 29.0604L3.19438 29.4078Z"
        fill="#0C727E"
        fillOpacity="0.65"
      />
      <circle
        cx="35.223"
        cy="28.3793"
        r="0.710331"
        fill="#4597A1"
        fillOpacity="0.45"
      />
      <circle
        cx="34.9255"
        cy="34.6277"
        r="0.41281"
        fill="#4597A1"
        fillOpacity="0.6"
      />
    </g>
    <defs>
      <clipPath id="clip0_6440_5902">
        <rect width="36" height="36" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function TasksCompletedWidget() {
  const navigate = useNavigate();

  return (
    <WidgetContainer width="100%">
      <>
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text textStyle="mobile.h2">Mandatory Tasks Completed!</Text>
          <Text
            textStyle="mobile.h3"
            color="primary.700"
            fontWeight="600"
            textDecoration="underline"
            cursor="pointer"
            _hover={{
              color: "primary.700",
              opacity: 0.8,
            }}
            onClick={() => navigate(PARTICIPANTS_SCHEDULE_PAGE)}
          >
            Tasks
          </Text>
        </Flex>

        <Flex w="100%" alignItems="center" gap="12px">
          <TrophyIcon />
          <Text textStyle="mobile.b1" flex="1">
            You&apos;ve completed your mandatory tasks for the week.
          </Text>
        </Flex>
      </>
    </WidgetContainer>
  );
}
