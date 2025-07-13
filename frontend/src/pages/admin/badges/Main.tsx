
import React from "react";
import { Switch } from "@chakra-ui/react";
import { useQuery, useMutation, gql } from "@apollo/client";
import CommonTable, { TableData, ColumnInfoTypes } from "../../../components/admin/CommonTable";
import { GET_ALL_BADGES } from "../../../gql/queries";

const UPDATE_BADGE_STATUS = gql`
  mutation UpdateBadgeStatus($badgeId: ID!, $isActive: Boolean!) {
    updateBadgeStatus(badgeId: $badgeId, isActive: $isActive) {
      badge_id
      is_active
    }
  }
`;

const SystemBadgesPage: React.FC = () => {
  const { loading, error, data: rawData } = useQuery(GET_ALL_BADGES);

  const [updateBadgeStatus] = useMutation(UPDATE_BADGE_STATUS, {
    refetchQueries: [{ query: GET_ALL_BADGES }],
  });

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;

  const data: TableData[] = rawData.getSystemBadges.map((badge: any) => {
    // compute opacity: 1 for active, .5 for inactive
    const cellStyle = { opacity: badge.is_active ? 1 : 0.5 };
  
    return {
      id: badge.badge_id,
      icon: (
        <div style={cellStyle}>
          <img
            src={`/badges/${badge.icon.toLowerCase()}.svg`}
            alt={badge.name}
            style={{ width: 24, height: 24 }}
          />
        </div>
      ),
      name: (
        <span style={cellStyle}>
          {badge.name}
        </span>
      ),
      description: (
        <span style={cellStyle}>
          {badge.description}
        </span>
      ),
      levels: (
        <span style={cellStyle}>
          {badge.offered_levels.join(", ")}
        </span>
      ),
      active: (
        <div style={cellStyle}>
          <Switch
            isChecked={badge.is_active}
            onChange={() =>
              updateBadgeStatus({
                variables: {
                  badgeId: badge.badge_id,
                  isActive: !badge.is_active,
                },
                optimisticResponse: {
                  updateBadgeStatus: {
                    __typename: "Badge",
                    badge_id: badge.badge_id,
                    is_active: !badge.is_active,
                  },
                },
              })
            }
          />
        </div>
      ),
    };
  });

  const columnInfo: ColumnInfoTypes[] = [
    { header: "Icon",           key: "icon" },
    { header: "Badge Name",     key: "name" },
    { header: "Description",    key: "description" },
    { header: "Offered Levels", key: "levels" },
    { header: "Status",         key: "active" },
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
