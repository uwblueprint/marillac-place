import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import EditCustomBadgeModal from "./EditCustomBadgeModal";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import { CustomBadge } from "../../../../types/models";
import { Marker, Trash } from "../../../../ui/icons/ActionIcons";
import { ICON_MAP } from "../../../../constants/icons";
import { AdminContext } from "../../../AdminContext";
import { ADMIN } from "../../../../constants/roles";

type CustomBadgeTableProps = {
  loading: boolean;
  error: any;
  badges: CustomBadge[];
  refetch: () => void;
};

const CustomBadgeTable = ({
  loading,
  error,
  badges,
  refetch,
}: CustomBadgeTableProps) => {
  const { role } = useContext(AdminContext);

  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<CustomBadge | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");

  const [deleteCustomBadge, { loading: deleteCustomBadgeLoading }] =
    useMutation(DELETE_CUSTOM_BADGE);

  async function handleDelete(id: number) {
    setDeleteError("");
    try {
      await deleteCustomBadge({
        variables: {
          cid: id,
        },
      });
      await refetch();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  }

  const columns: Column[] = [
    { header: "Icon", width: "5%", center: true },
    { header: "Badge Name", width: "25%" },
    { header: "Description", width: "68%" },

    ...(role === ADMIN ? [
      { header: "", width: "1%" },
      { header: "", width: "1%" },
    ] : []),
  ];

  const rows: Row[][] = badges.length
    ? badges.map((badge: CustomBadge) => {
        const IconComponent = ICON_MAP[badge.icon];
        return [
          { element: <IconComponent size={20} /> },
          { element: badge.name },
          { element: badge.description },

          ...(role === ADMIN ? [
            {
              element: <Marker size={20} />,
              action: () => {
                setSelected(badge);
                setEdit(true);
              },
            },
            {
              element: <Trash size={20} />,
              action: async () => handleDelete(badge.cid),
            },
          ] : []),
        ];
      })
    : [];

  if (edit && selected) {
    return (
      <EditCustomBadgeModal
        onClose={() => {
          setEdit(false);
          setSelected(null);
        }}
        selected={selected}
        refetch={refetch}
      />
    );
  }

  return (
    <DataTable
      loading={loading || deleteCustomBadgeLoading}
      error={error + deleteError}
      columns={columns}
      rows={rows}
    />
  );
};

export default CustomBadgeTable;
