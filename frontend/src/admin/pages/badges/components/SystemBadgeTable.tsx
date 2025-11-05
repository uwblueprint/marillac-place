import { Text, Flex, Image as ChakraImage, Switch } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BADGE_STATUS } from "../../../../gql/mutations";
import EditSystemBadgeModal from "./EditSystemBadgeModal";
import DataTable from "../../../common/misc/DataTable";

type SystemBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: any[];
};

const SystemBadgeTable = ({
  loading,
  error,
  badges,
}: SystemBadgeTableProps) => {
  const levels = ["N", "B", "S", "G", "D"];
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [statuses, setStatuses] = useState<Record<number, boolean>>({});
  const [updateBadgeStatus] = useMutation(UPDATE_BADGE_STATUS);

  useEffect(() => {
    setStatuses(
      badges.reduce((acc, badge) => {
        acc[badge.badge_id] = badge.is_active;
        return acc;
      }, {})
    );
  }, [badges]);

  async function changeActivityStatus(badge_id: number, is_active: boolean) {
    try {
      await updateBadgeStatus({
        variables: {
          badge_id,
          is_active,
        },
      });
      setStatuses((prev: any) => ({
        ...prev,
        [badge_id]: is_active,
      }));
    } catch (err: any) {
      console.log(err.message);
    }
  }
  const columns = [
    { header: "Icon", width: "5%" },
    { header: "Badge Name", width: "35%" },
    { header: "Description", width: "40%" },
    { header: "Offered Levels", width: "10%" },
    { header: "Status", width: "5%" },
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
          <Text
            key={`levels-${badge.badge_id}`}
            textStyle="web.b3"
            color="#000000"
          >
            {levels.slice(0, badge.badge_level.length).join(", ")}
          </Text>,
          <Flex
            key={`status-${badge.badge_id}`}
            alignItems="center"
            justifyContent="center"
          >
            <Switch
              isChecked={!!statuses[badge.badge_id]}
              onChange={() =>
                changeActivityStatus(badge.badge_id, !statuses[badge.badge_id])
              }
            />
          </Flex>,
          <Flex
            key={`actions-${badge.badge_id}`}
            alignItems="center"
            justifyContent="center"
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
          </Flex>,
        ];

        return cells;
      })
    : [];

  const editModal = (
    <EditSystemBadgeModal
      isOpen={edit}
      onClose={() => setEdit(false)}
      selected={selected}
    />
  );

  return (
    <DataTable
      loading={loading}
      edit={edit}
      selected={selected}
      error={error}
      columns={columns}
      rows={rows}
      editModal={editModal}
    />
  );
};

export default SystemBadgeTable;
