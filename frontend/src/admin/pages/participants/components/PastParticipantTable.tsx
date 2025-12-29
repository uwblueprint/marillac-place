import { Text, Flex } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAST_PARTICIPANTS } from "../../../../gql/participantRequests";
import EditPastParticipantCard from "./EditPastParticipantCard";
import DataTable, { Row } from "../../../../ui/misc/DataTable";
import { formatDateMonthDayYear } from "../../../../helpers/formatDateTime";

type SortIconProps = {
  state: number;
};

function SortIcon({ state }: SortIconProps) {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
    >
      <ExpandLessIcon
        style={{
          width: "0.5em",
          height: "0.5em",
          color: state === 0 || state === 2 ? "#6C707A" : "#000000",
          transform: "translateY(3.5px)",
        }}
      />
      <ExpandMoreIcon
        style={{
          width: "0.5em",
          height: "0.5em",
          color: state === 0 || state === 1 ? "#6C707A" : "#000000",
          transform: "translateY(-1.5px)",
        }}
      />
    </Flex>
  );
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
      sorted = [...pastParticipants].sort((a: any, b: any) => a.pid - b.pid);
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) => b.pid - a.pid);
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
      sorted = [...pastParticipants].sort((a: any, b: any) =>
        a.arrival.localeCompare(b.arrival)
      );
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) =>
        b.arrival_date.localeCompare(a.arrival)
      );
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
      sorted = [...pastParticipants].sort((a: any, b: any) =>
        a.departure.localeCompare(b.departure)
      );
    } else {
      sorted = [...pastParticipants].sort((a: any, b: any) =>
        b.departure.localeCompare(a.departure)
      );
    }

    setPastParticipants(sorted);
    setDepartureState(newState);
  }

  const columns = [
    {
      header: "ID Number",
      width: "30%",
      sort: (
        <div onClick={() => handleIdStateChange()}>
          <SortIcon state={idState} />
        </div>
      ),
    },
    {
      header: "Arrival Date",
      width: "30%",
      sort: (
        <div onClick={() => handleArrivalStateChange()}>
          <SortIcon state={arrivalState} />
        </div>
      ),
    },
    {
      header: "Departure Date",
      width: "30%",
      sort: (
        <div onClick={() => handleDepartureStateChange()}>
          <SortIcon state={departureState} />
        </div>
      ),
    },
    { header: "", width: "10%" },
  ];

  const rows: Row[][] = pastParticipants.length
    ? pastParticipants.map((participant: any, index: number) => {
        const arrivalDate = formatDateMonthDayYear(
          new Date(participant.arrival)
        );
        const departureDate = participant.departure
          ? formatDateMonthDayYear(new Date(participant.departure))
          : "N/A";
        const cells: JSX.Element[] = [
          <Text
            key={`id-${participant.pid}`}
            textStyle="web.b3"
            color="#000000"
          >
            {participant.pid}
          </Text>,
          <Text
            key={`arrival-${participant.pid}`}
            textStyle="web.b3"
            color="#000000"
          >
            {arrivalDate}
          </Text>,
          <Text
            key={`departure-${participant.pid}`}
            textStyle="web.b3"
            color="#000000"
          >
            {departureDate}
          </Text>,
          <Flex
            key={`actions-${participant.pid}`}
            alignItems="center"
            justifyContent="flex-end"
            gap="15px"
          >
            <Flex
              onClick={() => {
                setSelectedId(participant.pid);
                setSelectedArrival(participant.arrival);
                setSelectedDeparture(participant.departure);
                setEdit(true);
              }}
            >
              <EditIcon
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  color: "#000000",
                  cursor: "pointer",
                }}
              />
            </Flex>
          </Flex>,
        ];
        return cells.map((cell, cellIndex) => ({ element: cell } as Row));
      })
    : [];

  const editModal = (
    <EditPastParticipantCard
      id={selectedId}
      arrival={selectedArrival}
      departure={selectedDeparture}
      close={() => setEdit(false)}
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error?.message}
      />
      {edit && editModal}
    </>
  );
};

export default PastParticipantTable;
