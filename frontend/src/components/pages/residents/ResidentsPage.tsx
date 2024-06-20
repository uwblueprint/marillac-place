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
import ResidentModal from "./ResidentModal";
import { residentsMockData } from "../../../mocks/residents";

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "ID Number",
    key: "residentId",
  },
  {
    header: "Room #",
    key: "roomNumber",
  },
  {
    header: "Arrival Date",
    key: "arrivalDate",
  },
  {
    header: "Departure Date",
    key: "departureDate",
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
          onClick={() => setIsModalOpen(true)}
        >
          Add Resident
        </Button>
      </Flex>
      <CommonTable
        data={residents}
        columnInfo={columnTypes}
        onEdit={() => {}}
      />
      <ResidentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </Flex>
  );
};

export default ResidentsPage;
