import React, { useState } from "react";
import {
  Flex,
  Input,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text
} from "@chakra-ui/react";
import { Add, Search } from "@mui/icons-material";

import { useQuery } from "@apollo/client";
import { GET_PAST_PARTICIPANTS, GET_CURRENT_PARTICIPANTS } from "../../../gql/queries";

import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import SideBar from "../../common/SideBar";
import AddParticipantCard from "./AddParticipantCard";
import EditParticipantCard from "./EditParticipantCard";
import EditPastParticipantCard from "./EditPastParticipantCard";
import CurrentParticipantCard from "./CurrentParticipantCard";

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "ID Number",
    key: "participantId",
    display: true,
  },
  {
    header: "Arrival Date",
    key: "arrival",
    display: true,
  },
  {
    header: "Departure Date",
    key: "departure",
    display: true,
  }
];

const ParticipantsPage = (): React.ReactElement => {
  const [addParticipant, setAddParticipant] = useState(false);
  const [editPastParticipant, setEditPastParticipant] = useState(false);
  const [selected, setSelected] = useState({});

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
    <Flex
      w="100vw"
      h="100vh"
    >
      <SideBar />
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
      >
        <Flex
          w="100%"
          h="50px"
          bg="#E3ECEB"
        />
        <Flex
          w="100%"
          h="100%"
          padding="30px"
          flexDir="column"
          justifyContent="space-between"
        >
          <Flex
            w="100%"
            flexDir="column"
            marginBottom="20px"
          >
            <Text fontSize="lg" fontWeight="600" color="#15646E">Current Participants</Text>
            {getCurrentParticipantsLoading ? (
              <Spinner />
            ) : getCurrentParticipantsError ? (
              <Flex>{getCurrentParticipantsError.message}</Flex>
            ) : getCurrentParticipantsData.getCurrentParticipants ? 
              getCurrentParticipantsData.getCurrentParticipants.map((participant: TableData) =>
                <CurrentParticipantCard key={participant.participantId} roomNumber={participant.roomNumber} participantId={participant.participantId} arrival={participant.arrival} password={participant.password} />
              )
            : (
              <Flex>An unknown issue has occured.</Flex>
            )}
          </Flex>
          <Flex
            w="100%"
            flexDir="column"
          >
            <Text fontSize="lg" fontWeight="600" color="#15646E">Past Participants</Text>
            {getPastParticipantsLoading ? (
              <Spinner />
            ) : getPastParticipantsError ? (
              <Flex>{getPastParticipantsError.message}</Flex>
            ) : getPastParticipantsData.getPastParticipants ? (
              <CommonTable
                data={getPastParticipantsData.getPastParticipants
                  .map((participant: TableData) => ({
                    participantId: participant.participantId,
                    arrival: participant.arrival,
                    departure: participant.departure,
                  }))}
                columnInfo={columnTypes}
                onEdit={(row: any) => {
                  setSelected(row);
                  setEditPastParticipant(true);
                }}
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
        {/* <Flex flexDir="column" flexGrow={1} p="20px">
          <Flex justifyContent="space-between" p="10px">
            <InputGroup w="30%">
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search"
                onChange={(e) => setParticipantFilter(e.target.value)}
              />
            </InputGroup>
            <Button
              variant="primary"
              bg="orange.500"
              leftIcon={<Icon as={Add} color="white" />}
              size="sm"
              onClick={() => setAddParticipant(true)}
            >
              Add Participant
            </Button>
          </Flex>
          {getAllParticipantsLoading ? (
            <Spinner />
          ) : getAllParticipantsError ? (
            <Flex p="10px">{getAllParticipantsError.message}</Flex>
          ) : getAllParticipantsData.getAllParticipants ? (
            <CommonTable
              data={getAllParticipantsData.getAllParticipants
                .filter((participant: TableData) =>
                  participant.participantId.includes(participantFilter),
                )
                .map((participant: TableData) => ({
                  participantId: participant.participantId,
                  roomNumber: participant.roomNumber,
                  arrival: participant.arrival,
                  departure: participant.departure || "",
                  password: participant.password,
                }))}
              columnInfo={columnTypes}
              onEdit={(row: any) => {
                setSelectedParticipant(row);
                setEditParticipant(true);
              }}
            />
          ) : (
            <Flex p="10px">No participants found.</Flex>
          )}

          {addParticipant && (
            <AddParticipantCard close={() => setAddParticipant(false)} />
          )}
          {editParticipant && selectedParticipant && (
            <EditParticipantCard
              selected={selectedParticipant}
              close={() => setEditParticipant(false)}
            />
          )}
        </Flex> */}
      </Flex>
    </Flex>
  );
};

export default ParticipantsPage;
