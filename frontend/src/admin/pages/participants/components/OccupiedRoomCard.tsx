import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Participant } from "../../../../types/models";
import OrangeButton from "../../../../ui/buttons/OrangeButton";
import EditParticipantCard from "./EditParticipantCard";

type ParticipantByRoom = Record<number, Participant>;

type OccupiedRoomCardProps = {
  roomNumber: number;
  participant: Participant;
  participantsByRoom: ParticipantByRoom;
  onParticipantsUpdated: () => Promise<void>;
};

const OccupiedRoomCard = ({
  roomNumber,
  participant,
  participantsByRoom,
  onParticipantsUpdated,
}: OccupiedRoomCardProps): React.ReactElement => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Flex
      height="130px"
      border="1px"
      borderColor="neutral.300"
      borderRadius="8px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
      gap="5px"
      pb="2px"
    >
      <Flex
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="30px"
        justifyContent="center"
        alignItems="center"
        borderBottom="1px"
        borderColor="neutral.300"
        bg="primary.100"
      >
        <Text textStyle="web.s1">Room {roomNumber}</Text>
      </Flex>

      <Text textStyle="web.b3">
        ID Number:&nbsp;
        <Text as="span" fontWeight="700">
          #{participant.pid}
        </Text>
      </Text>
      <Text textStyle="web.b3">
        Arrival Date:&nbsp;
        <Text as="span" fontWeight="700">
          {participant.arrival}
        </Text>
      </Text>

      <Flex position="absolute" bottom="12px">
        <OrangeButton
          label="Edit Participant"
          action={() => setIsEditing(true)}
          is_active={isEditing}
        />
      </Flex>

      {isEditing && (
        <EditParticipantCard
          roomNumber={roomNumber}
          participant={participant}
          participantsByRoom={participantsByRoom}
          onClose={() => setIsEditing(false)}
          onParticipantsUpdated={onParticipantsUpdated}
        />
      )}
    </Flex>
  );
};

export default OccupiedRoomCard;
