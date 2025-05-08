import { TableContainer, Table, Thead, Tbody, Tr, Th, Td, Text, Flex, Spinner } from "@chakra-ui/react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAST_PARTICIPANTS } from "../../../../gql/queries";
import EditPastParticipantCard from "./EditPastParticipantCard";

function SortIcon() {
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
        color: "#6C707A",
        transform: "translateY(3.5px)"
      }} />
      <ExpandMoreIcon style={{
        width: "0.5em",
        height: "0.5em",
        color: "#6C707A",
        transform: "translateY(-1.5px)"
      }} />
    </Flex>
  )
}

const PastParticipantTable = () => {
  const { loading, error, data } = useQuery(GET_PAST_PARTICIPANTS);
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedArrival, setSelectedArrival] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState("");

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
                  <SortIcon />
                </Flex>
              </Th>
              <Th width="30%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">Arrival Date</Text>
                  <SortIcon />
                </Flex>
              </Th>
              <Th width="30%">
                <Flex alignItems="center" gap="8px">
                  <Text textStyle="web.s1" color="#000000" textTransform="none">Departure Date</Text>
                  <SortIcon />
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
              data.getPastParticipants.map((participant: any, index: number) => (
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