import React, { useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import ParticipantPageHeader from '../../../common/participant/PageHeader';
import { EditGoal } from './elements/EditGoal';


export default function ParticipantsProgressPage() {
  const [editGoal, setEditGoal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setEditGoal(false);
  };

  

  return (
    <>
      <ParticipantPageHeader currentPage="Progress" />
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
        
          <Text borderBottom="1px" textStyle="web.c1" onClick={() => setEditGoal(true)}>Edit Goal</Text>
        </Flex>
      </Flex>
      { editGoal &&
        <EditGoal 
          handleClose={handleClose} 
        />
      }
    </>
  )
}