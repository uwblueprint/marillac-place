import React, { useEffect, useState } from "react";
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

import { useQuery, useLazyQuery } from "@apollo/client";
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
  },
  {
    header: "Room #",
    key: "roomNumber",
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
  const [addParticipant, setAddParticipant] = useState(false);
  const [editParticipant, setEditParticipant] = useState(false);
  const [selected, setSelected] = useState(null);

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
            <Input placeholder="Search" />
          </InputGroup>
          <Button
            variant="primary"
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
            data={getAllParticipantsData.getAllParticipants.map(
              (participant: TableData) => ({
                participantId: participant.participantId,
                roomNumber: participant.roomNumber,
                arrival: participant.arrival,
                departure: participant.departure || "",
              }),
            )}
            columnInfo={columnTypes}
            onEdit={(row: any) => {
              setSelected(row);
              setEditParticipant(true);
            }}
          />
        ) : (
          <Flex p="10px">No participants found.</Flex>
        )}

        {addParticipant && <AddParticipantCard close={() => setAddParticipant(false)} />}
        {/* {editParticipant && selected && <EditParticipantCard preset={selected} close={() => setEditParticipant(false)} />} */}
      </Flex>
    </Flex>
  );
};

export default ParticipantsPage;
