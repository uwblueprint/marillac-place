import { Text, Flex, Image as ChakraImage, Switch } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_SYSTEM_BADGE } from "../../../../gql/systemBadgeRequests";
import EditSystemBadgeModal from "./EditSystemBadgeModal";
import DataTable from "../../../../ui/misc/DataTable";
import useNotification from "../../../../hooks/useNotification";

type SystemBadgeTableProps = {
  loading: boolean;
  error: string | null;
  badges: any[];
};

const SystemBadgeTable = ({ loading, error, badges }: SystemBadgeTableProps) => {
  const levels = ["N", "B", "S", "G", "D"];
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [statuses, setStatuses] = useState<Record<number, boolean>>({});
  const [updateBadgeStatus] = useMutation(UPDATE_SYSTEM_BADGE);
  const { sendNotification } = useNotification();

  useEffect(() => {
    setStatuses(
      badges.reduce((acc, badge) => {
        acc[badge.badge_id] = badge.is_active;
        return acc;
      }, {} as Record<number, boolean>)
    );
  }, [badges]);

  const changeActivityStatus = async (badge_id: number, is_active: boolean) => {
    const badgeName = badges.find((b) => b.badge_id === badge_id)?.name;
    try {
      await updateBadgeStatus({
        variables: {
          name: badgeName,
          isActive: is_active,
        },
      });
      setStatuses((prev) => ({
        ...prev,
        [badge_id]: is_active,
      }));
      sendNotification(`System badge ${badgeName} ${is_active ? "activated" : "deactivated"}`);
      // optional: reload page to fully match other components
      window.location.reload();
    } catch (err: unknown) {
      console.log(err instanceof Error ? err.message : String(err));
      sendNotification(`Failed to update status for ${badgeName}`);
    }
  };

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
            <Flex
              align="center"
              justify="center"
              cursor="pointer"
              onClick={() => {
                setSelected(badge);
                setEdit(true);
              }}
            >
              <EditIcon style={{ width: "1.2rem", height: "1.2rem" }} />
            </Flex>
          ),
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
    <>
      <DataTable
        loading={loading}
        error={error || undefined}
        columns={columns}
        rows={rows}
      />
      {editModal}
    </>
  );
};

export default SystemBadgeTable;
