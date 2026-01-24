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
      top="21px"
      left="0px"
      zIndex={10}
      paddingX="20px"
    >
      {ROOM_NUMBERS.map((num: number) => (
        <Text
          key={num}
          textStyle="s1"
          color={selectedRoom === num ? "brand.primaryDark" : "text.dark"}
          cursor="pointer"
          onClick={() => changeRoom(num)}
          borderBottom="3px solid"
          borderColor={
            selectedRoom === num ? "brand.primaryDark" : "transparent"
          }
          px="10px"
          pb="10px"
        >
          Room {num}
        </Text>
      ))}
    </Flex>
  );
}
