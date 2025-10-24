import {
 Button,
 Flex,
 Input,
 InputGroup,
 InputLeftElement,
 Text,
 Switch,
 useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ParticipantPageHeader from '../../common/PageHeader';
import CreateProgressModal from "./components/CreateProgressModal";
import OrangeButton from "../../../admin/common/buttons/OrangeButton";


import { EditGoal } from './elements/EditGoal';
import WeeklyEarningsChart from "./elements/EarningsWidget";

export default function ParticipantsProgressPage() {
const [create, setCreate] = useState(false);
const [editGoal, setEditGoal] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const sampleWeeklyEarnings = [10, 15, 8, 20, 12, 18, 35];
  
  const handleClose = () => {
    setEditGoal(false);
  }

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
       marginTop="20px"
     >
       <Flex flexDirection="column" justifyContent="flex-start">
         <Text
           textStyle="web.c3" color="text.light.primary" fontWeight="800"
         >
           Marillac Bucks Goal
         </Text> 
         <Text
           textStyle="web.c3"
           color="text.light.primary"
           marginTop="9px"
         >
           Set a new goal to track your progress!
         </Text> 
       </Flex>


       <Flex flexDirection="column" justifyContent="flex-start">
         <OrangeButton
                 text="Set Goal"
                 action={() => setCreate(true)}
                 is_active={create}
        />
       </Flex>
       {create && <CreateProgressModal isOpen={create} onClose={() => setCreate(false)} />}
     </Flex>
     <div style={{ padding: "10px 20px" }}>
        <WeeklyEarningsChart weeklyEarnings={sampleWeeklyEarnings} />
      </div>
   </>
 )
};