// frontend/src/pages/admin/badges/SystemBadgesPage.tsx

import React from "react";
import { Switch } from "@chakra-ui/react";
import { useQuery, useMutation, gql } from "@apollo/client";
import CommonTable, { TableData, ColumnInfoTypes } from "../../../components/admin/CommonTable";
import { GET_ALL_BADGES } from "../../../gql/queries";

// ① Define the mutation that flips is_active
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

  // ② hook for the toggle mutation
  const [updateBadgeStatus] = useMutation(UPDATE_BADGE_STATUS, {
    // Re-fetch the badge list so our table updates automatically
    refetchQueries: [{ query: GET_ALL_BADGES }],
  });

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;

  // ③ map each badge into the TableData shape, replacing `active: boolean`
  //    with a <Switch> whose checked-state is badge.is_active
  const data: TableData[] = rawData.getSystemBadges.map((badge: any) => ({
    id:          badge.badge_id,
    icon:        (
      <img
        src={`/badges/${badge.icon.toLowerCase()}.svg`}
        alt={badge.name}
        style={{ width: 24, height: 24 }}
      />
    ),
    name:        badge.name,
    description: badge.description,
    levels:      badge.offered_levels.join(", "),
    active:      (
      <Switch
        isChecked={badge.is_active}
        onChange={() => {
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
          });
        }}
      />
    ),
    __raw:       badge,
  }));

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
