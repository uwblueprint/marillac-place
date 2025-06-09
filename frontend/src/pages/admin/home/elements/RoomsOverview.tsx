import { Flex, Text, Grid, Button, Link } from "@chakra-ui/react";
import React from "react";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

export default function RoomsOverview() {
  return (
    <Flex
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      height="55%"
      marginRight="10px"
      marginBottom="10px"
      flexDir="column"
    >
      <Text textStyle="web.h3" color="primary.700" marginBottom="15px">
        Rooms
      </Text>
      <Grid w="100%" templateColumns="repeat(5, 1fr)" gap="15px">
        {ROOM_NUMBERS.map((num) => (
          <Flex
            key={num}
            height="130px"
            border="1px solid"
            borderColor="neutral.300"
            borderRadius="8px"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center"
            padding="10px"
          >
            <Text
              textStyle="web.s1"
              bg="primary.100"
              width="100%"
              textAlign="center"
              padding="5px"
            >
              Room #{num}
            </Text>
            <Text
            textStyle="web.b3">
              ID Number: 
            </Text>
            <Text textStyle="web.b3">
              # Assigned Tasks
            </Text>
            <Link variant="underline" textStyle="web.b3" href="/admin/schedule">View Schedule</Link>
            {/* <Text textStyle="web.b3" textAlign="center">
              Room is available.
            </Text> */}
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
}