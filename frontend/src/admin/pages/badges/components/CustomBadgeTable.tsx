export {};
// TODO: Refactor this component
import { Text, Flex, Image as ChakraImage } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import { Trash } from "../../../../ui/icons/ActionIcons";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import EditCustomBadgeModal from "./EditCustomBadgeModal";
import DataTable from "../../../../ui/misc/DataTable";

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
  const [selected, setSelected] = useState<any | null>(null);

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

  const rows = badges.length
    ? badges.map((badge: any) => [
        {
          element: (
            <ChakraImage
              src={`/badges/${badge.icon.toLowerCase()}.svg`}
              alt={badge.name}
              style={{ width: "1.5rem", height: "1.5rem" }}
              opacity={0.5}
            />
          ),
        },
        {
          element: (
            <Text textStyle="web.b3" color="#000000" whiteSpace="normal">
              {badge.name}
            </Text>
          ),
        },
        {
          element: (
            <Text textStyle="web.b3" color="#000000" whiteSpace="normal">
              {badge.description}
            </Text>
          ),
        },
        {
          element: (
            <Flex alignItems="center" justifyContent="center" gap="15px">
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
                  }}
                />
              </Flex>

              <Flex
                cursor="pointer"
                onClick={() => handleDelete(badge.badge_id)}
              >
                <Trash size={16} />
              </Flex>
            </Flex>
          ),
        },
      ])
    : [];

  const editModal = selected && edit && (
    <EditCustomBadgeModal onClose={() => setEdit(false)} selected={selected} />
  );

  return (
    <>
      <DataTable
        loading={loading}
        error={error}
        columns={columns}
        rows={rows}
      />
      {editModal}
    </>
  );
};

export default CustomBadgeTable;
