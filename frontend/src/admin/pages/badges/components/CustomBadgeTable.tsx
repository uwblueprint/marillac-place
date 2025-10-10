import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Spinner,
  Image as ChakraImage,
} from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
// import EditCustomBadgeModal from "./EditCustomBadgeModal";
import EditSystemBadgeModal from "./EditSystemBadgeModal";
import { Icon } from "../../../../constants/icons";
import { DELETE_CUSTOM_BADGE } from "../../../../gql/mutations";
import EditCustomBadgeModal from "./EditCustomBadgeModal";
import AdminTable from "../../../common/misc/AdminTable";

type CustomBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: any[];
};

const CustomBadgeTable = ({
  loading,
  error,
  badges,
}: CustomBadgeTableProps) => {
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [deleteCustomBadge] = useMutation(DELETE_CUSTOM_BADGE);

  async function handleDelete(id: number) {
    try {
      await deleteCustomBadge({
        variables: {
          badge_id: id,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
    window.location.reload();
  }

  const columns = [
    { header: "Icon", width: "5%" },
    { header: "Badge Name", width: "25%" },
    { header: "Description", width: "65%" },
    { header: "Actions", width: "5%" },
  ];

  const rows: JSX.Element[][] = badges.length
    ? badges.map((badge: any) => {
        const cells: JSX.Element[] = [
          <ChakraImage
            key={`icon-${badge.badge_id}`}
            src={`/badges/${badge.icon.toLowerCase()}.svg`}
            alt={badge.name}
            style={{ width: "1.5rem", height: "1.5rem" }}
            opacity={0.5}
          />,
          <Text
            key={`name-${badge.badge_id}`}
            textStyle="web.b3"
            color="#000000"
            whiteSpace="normal"
          >
            {badge.name}
          </Text>,
          <Text
            key={`desc-${badge.badge_id}`}
            textStyle="web.b3"
            color="#000000"
            whiteSpace="normal"
          >
            {badge.description}
          </Text>,
          <Flex
            key={`actions-${badge.badge_id}`}
            alignItems="center"
            justifyContent="center"
            gap="15px"
          >
            <Flex
              cursor="pointer"
              onClick={() => {
                setSelected(badge);
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
            <Flex cursor="pointer" onClick={() => handleDelete(badge.badge_id)}>
              <DeleteOutlineIcon
                style={{
                  width: "1.3rem",
                  height: "1.3rem",
                  color: "#D34C5C",
                }}
              />
            </Flex>
          </Flex>,
        ];
        return cells;
      })
    : [];

  const editModal = (
    <EditCustomBadgeModal onClose={() => setEdit(false)} selected={selected} />
  );

  return (
    <>
      <AdminTable
        loading={loading}
        error={error}
        columns={columns}
        rows={rows}
        editModal={editModal}
        selected={selected}
        edit={edit}
      />
    </>
  );
};

export default CustomBadgeTable;
