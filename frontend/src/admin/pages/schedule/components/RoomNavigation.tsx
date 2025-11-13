import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

interface RoomNavigationProps {
  selectedRoom: number;
  onRoomChange: (room: number) => void;
}

export default function RoomNavigation({
  selectedRoom,
  onRoomChange,
}: RoomNavigationProps) {
  return (
    <Flex
      w="100%"
      justifyContent="space-around"
      alignItems="center"
      position="absolute"
      top="17px"
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
          onClick={() => onRoomChange(num)}
          borderBottom={selectedRoom === num ? "3px solid" : "0"}
          borderColor="primary.700"
          px="12px"
          pb="12px"
        >
          Room {num}
        </Text>
      ))}
    </Flex>
  );
}
