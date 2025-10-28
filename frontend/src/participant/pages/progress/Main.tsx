import React, { useContext, useState } from 'react';
import { Button, Flex, Text, Spinner } from '@chakra-ui/react';
import { useQuery } from "@apollo/client";

import BucksGoalCard from "./elements/BucksGoalCard";
import ParticipantPageHeader from '../../common/PageHeader';
import { EditGoal } from './elements/EditGoal';
import WeeklyEarningsChart from "./elements/EarningsWidget";
import { ParticipantContext } from "../../common/ParticipantContext";
import { GET_PARTICIPANT_GOAL } from "../../../gql/queries";

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];

  const participant = useContext(ParticipantContext);
  const participantId = participant?.id ?? "";

  const handleClose = () => {
    setEditGoal(false);
  };

  const { loading, error, data } = useQuery(GET_PARTICIPANT_GOAL, {
    variables: { participantId },
    skip: !participant,
  });

  if (error) {
    return <Flex>Something went wrong.</Flex>;
  }

  if (!participant || loading) {
    return <Spinner />;
  }

  return (
    <>
      <ParticipantPageHeader currentPage="Progress" />
      <BucksGoalCard
        value={data.getParticipantById.marillac_bucks ?? 0}
        goal={data.getParticipantById.marillac_bucks_goal}
        handleClick={() => setEditGoal(true)}
      />
      { editGoal &&
        <EditGoal 
          handleClose={handleClose} 
        />
      }
      <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>
    </>
  );
}
