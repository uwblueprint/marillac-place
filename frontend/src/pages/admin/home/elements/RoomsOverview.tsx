import { Flex, Text, Grid, Button, Link } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

export default function RoomsOverview() {
  // const {loading, error, data} = useQuery

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
      <Flex
        overflow="scroll"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Grid w="100%" templateColumns="repeat(5, 1fr)" gap="15px">
          {ROOM_NUMBERS.map((num) => (
            <Flex
              key={num}
              minWidth="100px"
              minHeight="120px"
              border="1px solid"
              borderColor="neutral.300"
              borderRadius="8px"
              flexDir="column"
              justifyContent="space-between"
              alignItems="center"
              paddingBottom="10px"
            >
              <Text
                textStyle="web.s1"
                bg="primary.100"
                width="100%"
                textAlign="center"
                padding="8px"
                borderBottom="1px solid"
                borderColor="neutral.300"
              >
                Room #{num}
              </Text>

              <Text textStyle="web.b3" textAlign="center">
                ID Number:{" "}
                <Text as="span" textStyle="web.s1">
                  #123
                </Text>
              </Text>
              <Text textStyle="web.b3" textAlign="center">
                # Assigned Tasks
              </Text>
              <Link
                href="/admin/schedule"
                textDecoration="underline"
                textAlign="center"
                textStyle="web.b3"
                fontFamily="Nunito"
                fontWeight={600}
                color="black"
                _hover={{
                  textDecoration: "none",
                }}
              >
                View Schedule
              </Link>
              {/* <Text textStyle="web.b3" textAlign="center">
              Room is available.
            </Text> */}
            </Flex>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
}
