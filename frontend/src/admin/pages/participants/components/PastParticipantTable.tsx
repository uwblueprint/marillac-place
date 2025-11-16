import React, { useMemo, useState } from "react";
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { GET_PAST_PARTICIPANTS } from "../../../../gql/participantRequests";
import { Participant } from "../../../../types/models";
import { formatDateInputValue } from "../../../../helpers/formatDateTime";
import EditPastParticipantCard from "./EditPastParticipantCard";

type SortDirection = "asc" | "desc" | null;
type SortKey = "pid" | "arrival" | "departure";

type PastParticipantTableProps = {
  onParticipantsUpdated: () => Promise<void>;
};

type SelectedParticipant = {
  pid: number;
  arrival: string;
  departure: string;
};

type SortIconProps = {
  direction: SortDirection;
};

const SortIcon = ({ direction }: SortIconProps): React.ReactElement => {
  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" cursor="pointer">
      <ExpandLessIcon
        style={{
          width: "0.6em",
          height: "0.6em",
          color: direction === "asc" ? "#000000" : "#6C707A",
          transform: "translateY(3px)",
        }}
      />
      <ExpandMoreIcon
        style={{
          width: "0.6em",
          height: "0.6em",
          color: direction === "desc" ? "#000000" : "#6C707A",
          transform: "translateY(-2px)",
        }}
      />
    </Flex>
  );
};

const formatDateDisplay = (value?: string | null) => {
  if (!value) return "—";
  return formatDateInputValue(new Date(value));
};

const PastParticipantTable = ({
  onParticipantsUpdated,
}: PastParticipantTableProps): React.ReactElement => {
  const { loading, error, data, refetch } = useQuery<{
    getPastParticipants: Participant[];
  }>(GET_PAST_PARTICIPANTS);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "pid",
    direction: null,
  });
  const [selectedParticipant, setSelectedParticipant] = useState<SelectedParticipant | null>(null);

  const participants = data?.getPastParticipants ?? [];

  const sortedParticipants = useMemo(() => {
    if (!sortConfig.direction) {
      return participants;
    }

    const sorted = [...participants];
    sorted.sort((a, b) => {
      const { key, direction } = sortConfig;
      const multiplier = direction === "asc" ? 1 : -1;

      if (key === "pid") {
        return (a.pid - b.pid) * multiplier;
      }

      const valueA = a[key] ?? "";
      const valueB = b[key] ?? "";
      return valueA.localeCompare(valueB) * multiplier;
    });
    return sorted;
  }, [participants, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }

      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }

      if (prev.direction === "desc") {
        return { key, direction: null };
      }

      return { key, direction: "asc" };
    });
  };

  const handleEditClose = () => {
    setSelectedParticipant(null);
  };

  const handleParticipantUpdated = async () => {
    await refetch();
    await onParticipantsUpdated();
    handleEditClose();
  };

  return (
    <>
      <WidgetContainer
        width="100%"
        paddingX="16px"
        paddingY="16px"
        loading={loading}
        error={error?.message}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Flex
                  alignItems="center"
                  gap="6px"
                  cursor="pointer"
                  onClick={() => handleSort("pid")}
                >
                  <Text textStyle="web.s1" color="text.light.secondary">
                    ID Number
                  </Text>
                  <SortIcon direction={sortConfig.key === "pid" ? sortConfig.direction : null} />
                </Flex>
              </Th>
              <Th>
                <Flex
                  alignItems="center"
                  gap="6px"
                  cursor="pointer"
                  onClick={() => handleSort("arrival")}
                >
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Arrival Date
                  </Text>
                  <SortIcon direction={sortConfig.key === "arrival" ? sortConfig.direction : null} />
                </Flex>
              </Th>
              <Th>
                <Flex
                  alignItems="center"
                  gap="6px"
                  cursor="pointer"
                  onClick={() => handleSort("departure")}
                >
                  <Text textStyle="web.s1" color="text.light.secondary">
                    Departure Date
                  </Text>
                  <SortIcon
                    direction={sortConfig.key === "departure" ? sortConfig.direction : null}
                  />
                </Flex>
              </Th>
              <Th textAlign="right">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Actions
                </Text>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedParticipants.length === 0 ? (
              <Tr>
                <Td colSpan={4}>
                  <Flex justifyContent="center" alignItems="center" py="20px">
                    <Text textStyle="web.b2" color="text.light.secondary">
                      No past participants.
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            ) : (
              sortedParticipants.map((participant) => (
                <Tr key={participant.pid}>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {participant.pid}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {formatDateDisplay(participant.arrival)}
                    </Text>
                  </Td>
                  <Td>
                    <Text textStyle="web.b3" color="#000000">
                      {formatDateDisplay(participant.departure)}
                    </Text>
                  </Td>
                  <Td>
                    <Flex justifyContent="flex-end" alignItems="center" gap="12px">
                      <IconButton
                        aria-label="Edit past participant"
                        icon={<EditIcon style={{ width: "1.2rem", height: "1.2rem" }} />}
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setSelectedParticipant({
                            pid: participant.pid,
                            arrival: participant.arrival,
                            departure: participant.departure ?? participant.arrival,
                          })
                        }
                      />
                      <IconButton
                        aria-label="Download participant details"
                        icon={<FileDownloadOutlinedIcon style={{ width: "1.3rem", height: "1.3rem" }} />}
                        size="sm"
                        variant="ghost"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </WidgetContainer>

      {selectedParticipant && (
        <EditPastParticipantCard
          id={selectedParticipant.pid}
          arrival={selectedParticipant.arrival}
          departure={selectedParticipant.departure}
          onClose={handleEditClose}
          onParticipantsUpdated={handleParticipantUpdated}
        />
      )}
    </>
  );
};

export default PastParticipantTable;
