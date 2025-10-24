import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, Text, Flex, Spinner } from "@chakra-ui/react";
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import React, {useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAST_PARTICIPANTS } from "../../../../gql/queries";
import EditPastParticipantCard from "./EditPastParticipantCard";

type SortIconProps = {
  state: number;
}

function SortIcon({ state }: SortIconProps) {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      <ExpandLessIcon style={{
        width: "0.5em",
        height: "0.5em",
        color: state === 0 || state === 2 ? "#6C707A" : "#000000",
        transform: "translateY(3.5px)"
      }} />
      <ExpandMoreIcon style={{
        width: "0.5em",
        height: "0.5em",
        color: state === 0 || state === 1 ? "#6C707A" : "#000000",
        transform: "translateY(-1.5px)"
      }} />
    </Flex>
  )
}

const PastParticipantTable = () => {
  const [pastParticipants, setPastParticipants] = useState([]);
  const { loading, error, data } = useQuery(GET_PAST_PARTICIPANTS);

  useEffect(() => {
    if (!loading && !error && data) {
      setPastParticipants(data.getPastParticipants);
    }
  }, [loading, error, data]);

  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedArrival, setSelectedArrival] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState("");

  const [idState, setIdState] = useState(0);
  const [arrivalState, setArrivalState] = useState(0);
  const [departureState, setDepartureState] = useState(0);

  function handleIdStateChange() {
    setArrivalState(0);
    setDepartureState(0);

    const newState = (idState + 1) % 3;
    let sorted: any;
    if (newState === 1) {
      sorted = [...pastParticipants].sort((a: any, b: any) => a.participant_id - b.participant_id);
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) => b.participant_id - a.participant_id);
    }

    setPastParticipants(sorted);
    setIdState(newState);
  }

  function handleArrivalStateChange() {
    setIdState(0);
    setDepartureState(0);

    const newState = (arrivalState + 1) % 3;
    let sorted: any;
    if (newState === 1) {
      sorted = [...pastParticipants].sort((a: any, b: any) => a.arrival_date.localeCompare(b.arrival_date));
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) => b.arrival_date.localeCompare(a.arrival_date));
    }

    setPastParticipants(sorted);
    setArrivalState(newState);
  }

  function handleDepartureStateChange() {
    setIdState(0);
    setArrivalState(0);

    const newState = (departureState + 1) % 3;
    let sorted: any;
    if (newState === 1) {
      sorted = [...pastParticipants].sort((a: any, b: any) => a.departure_date.localeCompare(b.departure_date));
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) => b.departure_date.localeCompare(a.departure_date));
    }

    setPastParticipants(sorted);
    setDepartureState(newState);
  }

  return (
    <>
      <TableContainer
        border="1px solid"
        borderColor="neutral.300"
        borderRadius="8px"
        mb="15px"
      >
        <Table>
          <Thead>
            <Tr backgroundColor="neutral.200" w="100%">
              <Th width="30%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">ID Number</Text>
                  <div onClick={() => handleIdStateChange()}><SortIcon state={idState} /></div>
                </Flex>
              </Th>
              <Th width="30%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">Arrival Date</Text>
                  <div onClick={() => handleArrivalStateChange()}><SortIcon state={arrivalState} /></div>
                </Flex>
              </Th>
              <Th width="30%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">Departure Date</Text>
                  <div onClick={() => handleDepartureStateChange()}><SortIcon state={departureState} /></div>
                </Flex>
              </Th>
              <Th width="10%">&nbsp;</Th>
            </Tr>
          </Thead>
          <Tbody>
            { loading ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4} textAlign="center">
                  <Spinner />
                </Td>
              </Tr>
            ) : error ? (
              <Tr outline="1px solid" outlineColor="neutral.300">
                <Td colSpan={4}>
                  <Text textStyle="web.b3" color="#000000" textAlign="center">{error.message}</Text>
                </Td>
              </Tr>
            ) : (
              pastParticipants.map((participant: any, index: number) => (
                <Tr
                  key={participant.participant_id}
                  outline={index % 2 ? "0px solid" : "1px solid"}
                  outlineColor="neutral.300"
                >
                  <Td>
                    <Text textStyle="web.b3" color="#000000">{participant.participant_id}</Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">{participant.arrival_date}</Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">{participant.departure_date}</Text>
                  </Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="flex-end" gap="15px" >
                      <Flex onClick={() => {
                        setSelectedId(participant.participant_id);
                        setSelectedArrival(participant.arrival_date);
                        setSelectedDeparture(participant.departure_date);
                        setEdit(true);
                      }}>
                        <EditIcon style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "#000000",
                          cursor: "pointer",
                        }} />
                      </Flex>
                      <FileDownloadOutlinedIcon style={{
                        width: "1.3rem",
                        height: "1.3rem",
                        color: "#000000",
                      }} />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      { edit && <EditPastParticipantCard id={selectedId} arrival={selectedArrival} departure={selectedDeparture} close={() => setEdit(false)} /> }
    </>
  )
};

export default PastParticipantTable;