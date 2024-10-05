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
import { useMutation } from "@apollo/client";
import {
  ADD_RESIDENT,
  UPDATE_RESIDENT,
  DELETE_RESIDENT,
} from "../../../APIClients/Mutations/ResidentsMutations";
import {
  UserResponse,
  UserRequest,
  UserRequestUpdate,
} from "../../../APIClients/Types/ResidentsType";

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

  const [addResident] = useMutation<{ addResident: UserResponse }>(
    ADD_RESIDENT,
  );

  const [updateResident] = useMutation<{
    userId: number;
    resident: UserResponse;
  }>(UPDATE_RESIDENT);

  const [deleteResident] = useMutation<{ userId: number }>(DELETE_RESIDENT);

  // const handleAddResident = async () => {
  //   try {
  //     const date = new Date();
  //     const formattedDate = date.toISOString().split("T")[0];

  //     const resident: UserRequest = {
  //       email: "dasfhsahfsoad@gmail.com",
  //       password: "qe8e9r789ewr",
  //       firstName: "Bob",
  //       lastName: "Bob",
  //       residentId: 1248120,
  //       birthDate: formattedDate,
  //       roomNumber: 3,
  //       credits: 500,
  //       dateJoined: formattedDate,
  //     };
  //     await addResident({ variables: { resident } });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleUpdateResident = async () => {
  //   try {
  //     const userId = 5;
  //     const resident: UserRequestUpdate = {
  //       lastName: "NEW NAME",
  //       roomNumber: 3,
  //       credits: 10,
  //     };
  //     await updateResident({ variables: { userId, resident } });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleDeleteResident = async () => {
  //   try {
  //     const userId = 1;
  //     await deleteResident({ variables: { userId } });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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
