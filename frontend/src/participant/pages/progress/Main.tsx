import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Flex, Spinner } from "@chakra-ui/react";
import ParticipantPageHeader from "../../../common/participant/PageHeader";
import BucksGoalCard from "./elements/BucksGoalCard";
import { ParticipantContext } from "../../../common/participant/ParticipantContext";
import { GET_PARTICIPANT_GOAL } from "../../../gql/queries";

export default function ParticipantsProgressPage() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id ?? "";

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
      />
    </>
  );
}
import React, { useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import ParticipantPageHeader from '../../common/PageHeader';
import { ParticipantContext } from '../../common/ParticipantContext';
import { EditGoal } from './components/EditGoal';
import { SetGoal } from './components/SetGoal';
import { GET_PARTICIPANT_BY_ID } from '../../../gql/queries';
import WeeklyEarningsChart from "./components/EarningsWidget";

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [setGoal, setSetGoal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const participantContext = useContext(ParticipantContext);
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];
  
  // Fetch participant data to get current goal
  const { data, refetch } = useQuery(GET_PARTICIPANT_BY_ID, {
    variables: { participantId: participantContext?.id },
    skip: !participantContext?.id,
  });
  
  const participant = data?.getParticipantById;
  const currentGoal = participant?.marillac_bucks_goal;
  const currentBalance = participant?.marillac_bucks || 0;
  
  // Log for debugging
  useEffect(() => {
    console.log("📊 Participant data:", participant);
    console.log("🎯 Current goal:", currentGoal);
    console.log("💰 Current balance:", currentBalance);
  }, [participant, currentGoal, currentBalance]);
  
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

  return (
    <>
      <Flex 
        width="90%"
        alignItems="flex-start"
        alignSelf="center"
        justifyContent="space-between"
        backgroundColor="white"
        gap="15px"
        paddingX="30px"
        paddingY="20px"
        border="1px"
        borderColor="#C5C8D8"
        borderRadius="8px"
        marginTop="20px">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Text
            textStyle="web.c1" color="text.light.primary" fontWeight="800"
          >
            Marillac Bucks Goal
          </Text> 
        
          <Text 
            borderBottom="1px" 
            textStyle="web.c1" 
            onClick={() => currentGoal ? setEditGoal(true) : setSetGoal(true)}
            cursor="pointer"
          >
            {currentGoal ? "Change Goal" : "Set Goal"}
          </Text>
        </Flex>
      </Flex>
      { setGoal &&
        <SetGoal 
          handleClose={handleClose}
          onGoalSet={handleGoalSet}
        />
      }
      { editGoal && currentGoal &&
        <EditGoal
          handleClose={handleClose}
          onGoalUpdated={handleGoalUpdated}
          currentGoal={currentGoal}
          currentBalance={currentBalance}
        />
      }
      <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>
    </>
  );
}
