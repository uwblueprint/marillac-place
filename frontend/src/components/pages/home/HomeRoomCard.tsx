import React from "react";
import { Flex, Heading, Text, Box, Circle } from "@chakra-ui/react";

// TODO: Change name to id when schedule is done

type Props = {
  room: string | number;
  residentId: number;
};

const RoomCard = ({ room, residentId }: Props): React.ReactElement => {
  return (
    <Box
      p="10px"
      border="solid"
      borderRadius="10px"
      borderColor="gray.300"
      background="white"
      minW="260px"
      w="20vw"
    >
      <Flex flexDir="column" ml={4} my={4}>
        <Heading size="sm" color="purple.500">
          Room {room} — ID{residentId}
        </Heading>
        <Flex flexDir="column" my="5px">
          <Flex flexDir="row">
            <Circle size="35px" border="solid" borderColor="gray.300" my={1}>
              <Flex alignItems="center" justifyContent="center" fontSize="sm">
                1
              </Flex>
            </Circle>
            <Flex
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              ml={3}
            >
              Pending Tasks
            </Flex>
          </Flex>
          <Flex flexDir="row">
            <Circle size="35px" border="solid" borderColor="gray.300" my={1}>
              <Flex alignItems="center" justifyContent="center" fontSize="sm">
                2
              </Flex>
            </Circle>
            <Flex
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              ml={3}
            >
              Tasks Assigned
            </Flex>
          </Flex>
          <Flex flexDir="row">
            <Circle size="35px" border="solid" borderColor="gray.300" my={1}>
              <Flex alignItems="center" justifyContent="center" fontSize="sm">
                2
              </Flex>
            </Circle>
            <Flex
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              ml={3}
            >
              Active Warnings
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default RoomCard;
