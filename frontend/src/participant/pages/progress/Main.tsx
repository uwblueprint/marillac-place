import React, { useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import ParticipantPageHeader from '../../common/PageHeader';
import { EditGoal } from './components/EditGoal';
import { SetGoal } from './components/SetGoal';

import WeeklyEarningsChart from "./components/EarningsWidget";

export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [setGoal, setSetGoal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];
  
  const handleClose = () => {
    setSetGoal(false);
    setEditGoal(false);
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
        
          <Text borderBottom="1px" textStyle="web.c1" onClick={() => setSetGoal(true)}>Set Goal</Text>
        </Flex>
      </Flex>
      { setGoal &&
        <SetGoal 
          handleClose={handleClose} 
        />
      }
      <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>
    </>
  );
}