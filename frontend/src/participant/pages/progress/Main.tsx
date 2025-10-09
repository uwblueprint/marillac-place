import React from "react";
import ParticipantPageHeader from "../../../common/participant/PageHeader";
import WeeklyEarningsChart from "./elements/EarningsWidget";

export default function ParticipantsProgressPage() {
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];

  return (
    <>
      <ParticipantPageHeader currentPage="Progress" />
      <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>
    </>
  );
}