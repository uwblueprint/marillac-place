import React from "react";
import CommonTable, {TableData, ColumnInfoTypes} from "../../../components/admin/CommonTable";

const SystemBadgesPage: React.FC = () => {
  const data: TableData[] = [
    {
      icon: "⭐",
      name: "Log In",
      description: "Log in for several days in a row.",
      levels: "N, B, S, G, D",
      active: "Yes",
    },
    {
      icon: "🛡️",
      name: "Perfect Score - Mandatory",
      description: "Completed all mandatory tasks.",
      levels: "N, B",
      active: "Yes",
    },
    {
      icon: "✏️",
      name: "Perfect Score - Optional",
      description: "Completed 3+ optional tasks.",
      levels: "N, B, S, G, D",
      active: "Yes",
    },
    {
      icon: "💲",
      name: "Money Earned Milestone",
      description: "Reach money milestones.",
      levels: "N",
      active: "No",
    },
    {
      icon: "🏆",
      name: "PR Leader",
      description: "Accumulation of other badges",
      levels: "N",
      active: "Yes",
    },
    {
      icon: "🧩",
      name: "Individual Goals Complete",
      description: "Set and complete individual goals",
      levels: "N",
      active: "Yes",
    },
  ];
  const columnInfo: ColumnInfoTypes[] = [
    { header: "Icon", key: "icon" },
    { header: "Badge Name", key: "name" },
    { header: "Description", key: "description" },
    { header: "Offered Levels", key: "levels" },
    { header: "Status", key: "active" },
  ];

const handleEdit = (row: unknown): unknown => {
  console.log("Edit row:", row);
  return row; // returning the row satisfies the expected return type
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