import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../common/ParticipantContext";
import { EditGoal } from "./components/EditGoal";
import { SetGoal } from "./components/SetGoal";
import {
  GET_PARTICIPANT_BY_ID,
  GET_WEEKLY_EARNINGS,
} from "../../../gql/queries";
import WeeklyEarningsChart from "./components/EarningsWidget";
import BucksGoalCard from "./elements/BucksGoalCard";

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [setGoal, setSetGoal] = useState(false);
  const participantContext = useContext(ParticipantContext);

  // Fetch participant data
  const {
    data: participantData,
    loading: loadingParticipant,
    refetch: refetchParticipant,
  } = useQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId: participantContext?.id },
    skip: !participantContext?.id,
  });

  // Fetch earnings data
  const {
    data: earningsData,
    loading: loadingEarnings,
    refetch: refetchEarnings,
  } = useQuery(GET_WEEKLY_EARNINGS, {
    variables: { participant_id: participantContext?.id },
    skip: !participantContext?.id,
  });

  const weeklyEarnings = earningsData?.getWeeklyEarnings || [
    0, 0, 0, 0, 0, 0, 0,
  ];
  const participant = participantData?.getParticipantById;
  const currentGoal = participant?.marillac_bucks_goal;
  const currentBalance = participant?.marillac_bucks || 0;

  const loading = loadingParticipant || loadingEarnings;

  const handleClose = () => {
    setSetGoal(false);
    setEditGoal(false);
  };

  const handleGoalSet = async () => {
    await refetchParticipant();
    handleClose();
  };

  const handleGoalUpdated = async () => {
    await refetchParticipant();
    handleClose();
  };
  if (loading) {
    return null;
  }

  const handleGoalClick = () => {
    if (currentGoal) {
      setEditGoal(true);
    } else {
      setSetGoal(true);
    }
  };

  return (
    <>
      <BucksGoalCard
        value={currentBalance}
        goal={currentGoal}
        onEditGoalClick={handleGoalClick}
      />
      {setGoal && (
        <SetGoal handleClose={handleClose} onGoalSet={handleGoalSet} />
      )}
      {editGoal && currentGoal && (
        <EditGoal
          handleClose={handleClose}
          onGoalUpdated={handleGoalUpdated}
          currentGoal={currentGoal}
          currentBalance={currentBalance}
        />
      )}
      <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={weeklyEarnings} />
      </div>
    </>
  );
}
