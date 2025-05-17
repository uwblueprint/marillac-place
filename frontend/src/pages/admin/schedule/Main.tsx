import { Flex, Button, Text, Spinner } from "@chakra-ui/react";
import EditIcon from '@mui/icons-material/Edit';
import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from "react";
import MarillacBalanceModal from "./elements/MarillacBalanceModal";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import { GET_PARTICIPANT_BY_ROOM } from "../../../gql/queries";

export default function AdminSchedulePage() {
  const [editMarillacBucks, setEditMarillacBucks] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const room = localStorage.getItem("scheduleSelectedRoom");
    if (!room) return 1;
    return parseInt(room, 10);
  });

  const [getParticipantByRoom, { loading, data, error }] = useLazyQuery(GET_PARTICIPANT_BY_ROOM);

  useEffect(() => {
    console.log(selectedRoom);
    localStorage.setItem("scheduleSelectedRoom", selectedRoom.toString());
    getParticipantByRoom({ variables: { room_number: selectedRoom } });
  }, [selectedRoom]);

  return (
    <>
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
        { ROOM_NUMBERS.map((num: number) => (
          <Text
            key={num}
            textStyle="web.b1"
            fontWeight="700"
            color={selectedRoom === num ? "primary.700" : "#000000"}
            cursor="pointer"
            onClick={() => setSelectedRoom(num)}
            borderBottom={selectedRoom === num ? "3px solid" : "0"}
            borderColor="primary.700"
            px="12px"
            pb="12px"
          >
            Room {num}
          </Text>
        ))}
      </Flex>
      { loading ? (
        <Spinner />
      ) : error ? (
        <Flex>{error.message}</Flex>
      ) : !data || !data.getParticipantByRoom ? (
        <Flex>This room is empty</Flex>
      ) : (
        <Flex>
          <Button
            padding="0px 15px"
            color="#0D8312"
            border="1px solid"
            borderColor="#0D8312"
            borderRadius="8px"
            bg="#ECFFED"
            gap="5px"
            _hover={{
              background: "#C9DEC9"
            }}
            onClick={() => setEditMarillacBucks(true)}
          >
            <Text textStyle="web.b1" fontWeight={700} color="inherit">{data.getParticipantByRoom.marillac_bucks} M-Bucks</Text>
            <EditIcon fontSize="small" />
          </Button>

          { editMarillacBucks &&
            <MarillacBalanceModal
              close={() => setEditMarillacBucks(false)}
              participantId={data.getParticipantByRoom.participant_id}
              currentBalance={data.getParticipantByRoom.marillac_bucks}
              roomNumber={data.getParticipantByRoom.room_number}
            />
          }
        </Flex>
      )}
    </>
  )
}