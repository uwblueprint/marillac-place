import React, { useState } from "react";
import {
  Flex,
  Input,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Add, Search } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import {
  GET_PAST_PARTICIPANTS,
  GET_CURRENT_PARTICIPANTS,
} from "../../../gql/queries";

import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import SideBar from "../../common/SideBar";
import AddParticipantCard from "./AddParticipantCard";
import EditPastParticipantCard from "./EditPastParticipantCard";
import CurrentParticipantCard from "./CurrentParticipantCard";
import EmptyParticipantCard from "./EmptyParticipantCard";
import CheckmarkSvg from "../../../assets/svg/CheckmarkSvg";

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "ID Number",
    key: "participantId",
  },
  {
    header: "Arrival Date",
    key: "arrival",
  },
  {
    header: "Departure Date",
    key: "departure",
  },
];

const ParticipantsPage = (): React.ReactElement => {
  const roomNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [addParticipant, setAddParticipant] = useState(false);
  const [editPastParticipant, setEditPastParticipant] = useState(false);
  const [selected, setSelected] = useState({});
  const [notification, setNotification] = useState(
    localStorage.getItem("notification"),
  );
  console.log(notification);
  if (notification) {
    setTimeout(() => {
      localStorage.setItem("notification", "");
      setNotification("");
    }, 3000);
  }

  const {
    loading: getPastParticipantsLoading,
    error: getPastParticipantsError,
    data: getPastParticipantsData,
  } = useQuery(GET_PAST_PARTICIPANTS);

  const {
    loading: getCurrentParticipantsLoading,
    error: getCurrentParticipantsError,
    data: getCurrentParticipantsData,
  } = useQuery(GET_CURRENT_PARTICIPANTS);

  return (
    <Flex w="100vw" h="100vh">
      {notification && (
        <Flex
          position="fixed"
          top="30px"
          left="50%"
          transform="translateX(-50%)"
          border="solid"
          borderColor="#259E29"
          zIndex="1000"
          paddingY="5px"
          paddingX="15px"
          justifyContent="center"
          alignItems="center"
          gap="10px"
          boxShadow="lg"
          bg="#EAFFEB"
        >
          <CheckmarkSvg />
          <Text color="#259E29" fontSize="xl" fontWeight="500" mb="0px">
            {notification}
          </Text>
        </Flex>
      )}
      <SideBar />
      <Flex w="100%" h="100%" flexDir="column">
        <Flex
          w="100%"
          h="50px"
          bg="#E3ECEB"
          position="fixed"
          borderBottom="solid"
          borderBottomColor="neutral.200"
          top="0px"
          zIndex="999"
        />
        <Flex
          w="100%"
          h="100%"
          paddingY="15px"
          paddingX="30px"
          flexDir="column"
        >
          <Flex w="100%" h="50%" flexDir="column" paddingTop="50px">
            <Text fontSize="xl" fontWeight="600" color="#15646E" mb="10px">
              Current Participants
            </Text>
            {getCurrentParticipantsLoading ? (
              <Spinner />
            ) : getCurrentParticipantsError ? (
              <Flex>{getCurrentParticipantsError.message}</Flex>
            ) : getCurrentParticipantsData?.getCurrentParticipants ? (
              <Flex
                w="100%"
                h="100%"
                alignItems="top"
                justifyContent="space-between"
                wrap="wrap"
              >
                {((): any => {
                  const currentParticipants: Record<string, any> = {};
                  getCurrentParticipantsData.getCurrentParticipants.forEach(
                    (participant: any) => {
                      currentParticipants[participant.roomNumber] = participant;
                    },
                  );

                  return roomNumbers.map((num) =>
                    num in currentParticipants ? (
                      <CurrentParticipantCard
                        key={num}
                        roomNumber={num}
                        participants={currentParticipants}
                      />
                    ) : (
                      <EmptyParticipantCard key={num} roomNumber={num} />
                    ),
                  );
                })()}
              </Flex>
            ) : (
              <Flex>An unknown issue has occurred.</Flex>
            )}
          </Flex>
          <Flex w="100%" h="50%" flexDir="column">
            <Text fontSize="xl" fontWeight="600" color="#15646E" mb="10px">
              Past Participants
            </Text>
            {getPastParticipantsLoading ? (
              <Spinner />
            ) : getPastParticipantsError ? (
              <Flex>{getPastParticipantsError.message}</Flex>
            ) : getPastParticipantsData.getPastParticipants ? (
              <CommonTable
                data={getPastParticipantsData.getPastParticipants.map(
                  (participant: TableData) => ({
                    participantId: participant.participantId,
                    arrival: participant.arrival,
                    departure: participant.departure,
                  }),
                )}
                columnInfo={columnTypes}
                onEdit={(row: any) => {
                  setSelected(row);
                  setEditPastParticipant(true);
                }}
                maxResults={4}
              />
            ) : (
              <Flex>No participants found.</Flex>
            )}
            {editPastParticipant && selected && (
              <EditPastParticipantCard
                selected={selected}
                close={() => setEditPastParticipant(false)}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ParticipantsPage;
