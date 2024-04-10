import React, { useState } from "react";
import {
  Flex,
  Input,
  Stack,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Add, Search } from "@mui/icons-material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import CommonTable, { ColumnInfoTypes } from "../../common/CommonTable";
import ParticipantsModal from "./ParticipantsModal";
import { participants } from "../../../mocks/participants"; // TODO: Replace mock data

const columnTypes: ColumnInfoTypes[] = [
  {
    header: "Room #",
    key: "room",
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

const ParticipantsPage = (): React.ReactElement => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Flex flexDirection="column" flexGrow={1} padding="20px">
      <Flex justifyContent="space-between" padding="10px" paddingBottom="10px">
        <InputGroup width="30%">
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>

        <Stack direction="row" spacing={4}>
          <Button
            leftIcon={
              <Icon as={FileDownloadOutlinedIcon} color="purple.main" />
            }
            bg="purple.100"
            _hover={{ bg: "gray.100" }}
            variant="outline"
            size="sm"
            onClick={() => {}}
          >
            Export
          </Button>
          <Button
            leftIcon={<Icon as={Add} color="white" />}
            bg="purple.main"
            color="white"
            _hover={{ bg: "purple.200" }}
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Add Participant
          </Button>
        </Stack>
      </Flex>
      <CommonTable
        data={participants}
        columnInfo={columnTypes}
        onEdit={() => {}}
      />
      <ParticipantsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </Flex>
  );
};

export default ParticipantsPage;
