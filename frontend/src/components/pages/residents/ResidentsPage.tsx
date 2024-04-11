import React, { useEffect, useState } from "react";
import {
  Flex,
  Input,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Add, Search } from "@mui/icons-material";

import CommonTable, {
  ColumnInfoTypes,
  TableData,
} from "../../common/CommonTable";
import ParticipantsModal from "./ResidentsModal";
import { residentsMockData } from "../../../mocks/residents";

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "Room #",
    key: "roomNumber",
  },
  {
    header: "Departure Date",
    key: "departureDate",
  },
  {
    header: "ID Number",
    key: "residentId",
  },
  {
    header: "Email",
    key: "email",
  },
];

const ResidentsPage = (): React.ReactElement => {
  const [residents, setResidents] = useState<TableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // TODO: Fetch residents from API
    setResidents(residentsMockData);
  }, []);

  return (
    <Flex flexDirection="column" flexGrow={1} padding="20px">
      <Flex justifyContent="space-between" padding="10px">
        <InputGroup width="30%">
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>
        <Button
          variant="primary"
          leftIcon={<Icon as={Add} color="white" />}
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Add Participant
        </Button>
      </Flex>
      <CommonTable
        data={residents}
        columnInfo={columnTypes}
        onEdit={() => {}}
      />
      <ParticipantsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </Flex>
  );
};

export default ResidentsPage;
