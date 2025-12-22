import { Text, Flex, Image as ChakraImage, Switch } from "@chakra-ui/react";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_SYSTEM_BADGE } from "../../../../gql/systemBadgeRequests";
import EditSystemBadgeModal from "./EditSystemBadgeModal";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import { BadgeLevel, SystemBadge } from "../../../../types/models";
import { ICON_MAP } from "../../../../constants/icons";
import { Marker } from "../../../../ui/icons/ActionIcons";
import { LEVEL_ABBREVIATION, LEVEL_ORDER } from "../../../../constants/levels";
import ToggleButton from "../../../../ui/buttons/ToggleButton";

type SystemBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: SystemBadge[];
  refetch: () => void;
};

const SystemBadgeTable = ({
  loading,
  error,
  badges,
  refetch,
}: SystemBadgeTableProps) => {
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<SystemBadge | null>(null);
  const [updateError, setUpdateError] = useState<string>("");

  const [updateBadgeStatus] = useMutation(UPDATE_SYSTEM_BADGE);

  async function changeActivityStatus(name: string, isActive: boolean) {
    try {
      await updateBadgeStatus({
        variables: {
          name,
          isActive,
        },
      });
      await refetch();
    } catch (err: any) {
      setUpdateError(err.message);
    }
  }
  const columns: Column[] = [
    { header: "Icon", width: "5%", center: true },
    { header: "Badge Name", width: "25%" },
    { header: "Description", width: "50%" },
    { header: "Offered Levels", width: "10%" },
    { header: "Status", width: "5%", center: true },
    { header: "", width: "5%" },
  ];

  const rows: Row[][] = badges.length
    ? badges.map((badge: SystemBadge) => {
        const IconComponent = ICON_MAP[badge.icon];
        const offeredLevels = LEVEL_ORDER.filter((level) =>
          badge.BadgeLevel?.some((bl) => bl.level === level)
        )
          .map((level) => LEVEL_ABBREVIATION[level])
          .join(", ");
        return [
          { element: <IconComponent size={20} /> },
          { element: badge.name },
          { element: badge.description },
          { element: offeredLevels },
          {
            element: (
              <ToggleButton active={badge.is_active} setActive={() => {}} />
            ),
            action: async () => {
              changeActivityStatus(badge.name, !badge.is_active);
            },
          },
          {
            element: <Marker size={20} />,
            action: () => {
              setSelected(badge);
              setEdit(true);
            },
          },
        ];
      })
    : [];

  return (
    <>
      <DataTable
        loading={loading}
        error={error + updateError}
        columns={columns}
        rows={rows}
      />
      { edit && selected && (
        <EditSystemBadgeModal
          isOpen={edit}
          onClose={() => {
            setEdit(false);
            setSelected(null);
          }}
          selected={selected}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default SystemBadgeTable;
