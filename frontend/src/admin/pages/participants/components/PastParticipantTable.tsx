import React, { useState } from "react";
import { ApolloError } from "@apollo/client";
import EditPastParticipantCard from "./EditPastParticipantCard";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import { formatDateV1 } from "../../../../helpers/formatDateTime";
import { Marker } from "../../../../ui/icons/ActionIcons";
import { Participant } from "../../../../types/models";

type PastParticipantTableProps = {
  participants: Participant[];
  refetch: () => void;
  loading: boolean;
  error: ApolloError | undefined;
};
const PastParticipantTable = ({
  participants,
  refetch,
  loading,
  error,
}: PastParticipantTableProps) => {
  const [edit, setEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedArrival, setSelectedArrival] = useState<Date | null>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<Date | null>(null);

  const columns: Column[] = [
    {
      header: "ID Number",
      width: "30%",
    },
    {
      header: "Arrival Date",
      width: "30%",
    },
    {
      header: "Departure Date",
      width: "30%",
    },
    { header: "", width: "10%" },
  ];

  const rows: Row[][] = participants.length
    ? participants.map((participant: Participant, index: number) => {
        return [
          {
            element: participant.pid,
          },
          {
            element: formatDateV1(new Date(participant.arrival)),
          },
          {
            element: participant.departure
              ? formatDateV1(new Date(participant.departure))
              : "",
          },
          {
            element: <Marker size={20} />,
            action: () => {
              setSelectedId(participant.pid);
              setSelectedArrival(new Date(participant.arrival));
              setSelectedDeparture(
                participant.departure ? new Date(participant.departure) : null
              );
              setEdit(true);
            },
          },
        ];
      })
    : [];

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error?.message}
      />
      {edit && selectedArrival && selectedDeparture && selectedId && (
        <EditPastParticipantCard
          id={selectedId}
          arrival={selectedArrival}
          departure={selectedDeparture}
          close={() => setEdit(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default PastParticipantTable;
