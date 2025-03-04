import React, { useState } from "react";
import {
  Flex,
  Input,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import { Add, Search } from "@mui/icons-material";

import { useQuery } from "@apollo/client";
import { GET_ALL_PARTICIPANTS } from "../../../gql/queries";

import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import SideBar from "../../common/SideBar";
import AddParticipantCard from "./AddParticipantCard";
import EditParticipantCard from "./EditParticipantCard";

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "ID Number",
    key: "participantId",
    display: true,
  },
  {
    header: "Room #",
    key: "roomNumber",
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
  },
  {
    header: "Password",
    key: "password",
    display: false,
  },
];

const ParticipantsPage = (): React.ReactElement => {
  const [addParticipant, setAddParticipant] = useState(false);
  const [editParticipant, setEditParticipant] = useState(false);
  const [participantFilter, setParticipantFilter] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState({});

  const {
    loading: getAllParticipantsLoading,
    error: getAllParticipantsError,
    data: getAllParticipantsData,
  } = useQuery(GET_ALL_PARTICIPANTS);

  return (
    <Flex>
      <SideBar />
      <Flex flexDir="column" flexGrow={1} p="20px">
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
      </Flex>
    </Flex>
  );
};

export default ParticipantsPage;
