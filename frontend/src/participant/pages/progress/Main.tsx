import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { ParticipantContext } from "../../common/ParticipantContext";
import { EditGoal } from "./components/EditGoal";
import { SetGoal } from "./components/SetGoal";
import { GET_PARTICIPANT_BY_ID } from "../../../gql/queries";
import WeeklyEarningsChart from "./components/EarningsWidget";
import BucksGoalCard from "./elements/BucksGoalCard";
import BadgeWidget from "./components/BadgeWidget";

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [setGoal, setSetGoal] = useState(false);
  const participantContext = useContext(ParticipantContext);
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];

  // Fetch participant data to get current goal
  const { data, loading, refetch } = useQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId: participantContext?.id },
    skip: !participantContext?.id,
  });

  const participant = data?.getParticipantById;
  const currentGoal = participant?.marillac_bucks_goal;
  const currentBalance = participant?.marillac_bucks || 0;

  const handleClose = () => {
    setSetGoal(false);
    setEditGoal(false);
  };

  const handleGoalSet = async () => {
    await refetch(); // Refresh data to show new goal
    handleClose();
  };

  const handleGoalUpdated = async () => {
    await refetch(); // Refresh data to show updated goal
    handleClose();
  };

  // Don't render goal section until data is loaded to avoid flickering
  if (loading) {
    return null; // or return a loading spinner if preferred
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
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>

      <div style={{ padding: "10px 20px" }}>
        <BadgeWidget badgesToDisplayInWidget={[{
                title: "Beginner Log In Badge",
                subtitle: "Completed 7 days in a row",
                badge: {
                    icon: "five_star",
                    rarity: "gold",
                    percentComplete: 100,
                },
            },
            {
                title: "Beginner Perfect Score Badge",
                subtitle: "Completed 7 days in a row",
                badge: {
                    icon: "diamond",
                    rarity: "diamond",
                    percentComplete: 50,
                },
            },
            {
                title: "Hello world",
                subtitle: "Completed 7 days in a row",
                badge: {
                    icon: "tool",
                    rarity: "green",
                    percentComplete: 100,
                },
            },]}/>
      </div>
    </>
  );
}
