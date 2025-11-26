export {};
// TODO: Refactor this component
import { Text, Flex, Image as ChakraImage, Switch } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_SYSTEM_BADGE } from "../../../../gql/systemBadgeRequests";
import EditSystemBadgeModal from "./EditSystemBadgeModal";
import DataTable from "../../../../ui/misc/DataTable";

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
  const [selected, setSelected] = useState<any | null>(null);

  const [statuses, setStatuses] = useState<Record<number, boolean>>({});
  const [updateBadgeStatus] = useMutation(UPDATE_SYSTEM_BADGE);

  useEffect(() => {
    setStatuses(
      badges.reduce((acc, badge) => {
        acc[badge.badge_id] = badge.is_active;
        return acc;
      }, {} as Record<number, boolean>)
    );
  }, [badges]);

  async function changeActivityStatus(badge_id: number, is_active: boolean) {
    try {
      await updateBadgeStatus({
        variables: {
          name: badges.find((b) => b.badge_id === badge_id)?.name,
          isActive: is_active,
        },
      });
      setStatuses((prev) => ({
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
        { element: <Text textStyle="web.b3">{badge.name}</Text> },
        { element: <Text textStyle="web.b3">{badge.description}</Text> },
        {
          element: (
            <Text textStyle="web.b3">
              {levels.slice(0, badge.badge_level.length).join(", ")}
            </Text>
          ),
        },
        {
          element: (
            <Switch
              isChecked={!!statuses[badge.badge_id]}
              onChange={() =>
                changeActivityStatus(badge.badge_id, !statuses[badge.badge_id])
              }
            />
          ),
        },
        {
          element: (
            <EditIcon
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
            />
          ),
          action: () => {
            setSelected(badge);
            setEdit(true);
          },
        },
      ])
    : [];

  const editModal = selected && edit && (
    <EditSystemBadgeModal
      isOpen={edit}
      onClose={() => setEdit(false)}
      selected={selected}
    />
  );

  return (
    <DataTable loading={loading} error={error} columns={columns} rows={rows} />
  );
};

export default SystemBadgeTable;
