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
import ResidentEditModal, { ResidentEditInfo } from "./ResidentEditModal";
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
];

const ResidentsPage = (): React.ReactElement => {
  const [residents, setResidents] = useState<TableData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState("none");
  const [residentEditInfo, setEditInfo] = useState<ResidentEditInfo>();

  useEffect(() => {
    // TODO: Fetch residents from API
    setResidents(residentsMockData);
  }, []);

  const handleResidentEdit = (row: any) => {
    setIsModalOpen("edit");
    // console.log(row);
    setEditInfo(row);
  };

  const handleResidentSubmitEdit = () => {
    setEditInfo(undefined);

    // TODO: modify data
  };

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
          onClick={() => setIsModalOpen("add")}
        >
          Add Resident
        </Button>
      </Flex>
      <CommonTable
        data={residents}
        columnInfo={columnTypes}
        onEdit={handleResidentEdit}
      />

      <ResidentModal
        isOpen={isModalOpen === "add"}
        setIsOpen={() => setIsModalOpen("none")}
      />

      {residentEditInfo && (
        <ResidentEditModal
          residentInfo={residentEditInfo}
          isOpen={isModalOpen === "edit"}
          setIsOpen={() => setIsModalOpen("none")}
          onCloseEditModal={handleResidentSubmitEdit}
        />
      )}
    </Flex>
  );
};

export default ResidentsPage;
