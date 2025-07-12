
import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import CommonTable, {TableData, ColumnInfoTypes} from "../../../components/admin/CommonTable";
import { GET_ALL_BADGES } from "../../../gql/queries";

const SystemBadgesPage: React.FC = () => {
    const {
        loading: getSystemBadgesLoading,
        error: getSystemBadgesError,
        data: getSystemBadgesData,
      } = useQuery(GET_ALL_BADGES);

  if (getSystemBadgesLoading) return <p>Loading…</p>;
  if (getSystemBadgesError)  return <p>Error: {getSystemBadgesError.message}</p>;

  const data: TableData[] = getSystemBadgesData.getSystemBadges.map((badge: any) => ({
    id:        badge.badge_id,
    icon:      badge.icon,
    name:      badge.name,
    description: badge.description,
    levels:    badge.offered_levels.join(", "),
    active:    badge.is_active,        
   
    __raw:     badge,
  }));

  const columnInfo: ColumnInfoTypes[] = [
    { header: "Icon", key: "icon" },
    { header: "Badge Name", key: "name" },
    { header: "Description", key: "description" },
    { header: "Offered Levels", key: "levels" },
    { header: "Status", key: "active" },
  ];

const handleEdit = (row: unknown): unknown => {
  console.log("Edit row:", row);
  return row;
};

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
        System Badges
      </h1>
      <p style={{ color: "gray", marginBottom: "16px" }}>
        System badges will be granted to participants automatically.
      </p>
      <CommonTable
        columnInfo={columnInfo}
        data={data}
        onEdit={handleEdit}
        maxResults={10}
        isSelectable={false}
        previewModal={false}
      />
    </div>
  );
};

export default SystemBadgesPage;