import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

interface RoomNavigationProps {
  selectedRoom: number;
  changeRoom: (room: number) => void;
}

export default function RoomNavigation({
  selectedRoom,
  changeRoom,
}: RoomNavigationProps) {
  return (
    <Flex
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      position="absolute"
      top="18px"
      left="0px"
      zIndex={10}
      paddingX="20px"
    >
      {ROOM_NUMBERS.map((num: number) => (
        <Text
          key={num}
          textStyle="web.b1"
          fontWeight="700"
          color={selectedRoom === num ? "primary.700" : "#000000"}
          cursor="pointer"
          onClick={() => changeRoom(num)}
          borderBottom="3px solid"
          borderColor={selectedRoom === num ? "primary.700" : "transparent"}
          px="12px"
          pb="10px"
        >
          Room {num}
        </Text>
      ))}
    </Flex>
  );
}
