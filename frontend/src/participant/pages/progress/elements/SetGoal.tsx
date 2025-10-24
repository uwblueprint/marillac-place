import { Button, Flex, Image, Input, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import ModalContainer from '../../../../admin/common/form/ModalContainer';

interface SetGoalProps {
    handleClose: () => void
}

export const SetGoal: React.FC<SetGoalProps> = ({handleClose}) => {
    const [goal, setGoal] = useState("")
    const [error, setError] = useState("")
    
    const handleSave = () => {
        try {
            // Add save goal logic here
        
            handleClose(); // only close if successful
          } catch (err) {
            console.error("Error saving goal:", err);
            setError("Failed to save goal — please try again.");
          }
    }

    return (
        <ModalContainer
            title="Set Goal"
            submit_text="Save"
            submit_action={handleSave}
            cancel_action={handleClose}
            error={error}
        >
            <Flex justify="space-between">
                <Text textStyle="web.b1">New goal:</Text>
                <Flex
                    align="center" justify="space-between"
                >
                    <Image src="/assets/marillac_bucks.png" alt="coin" />
                    <Input
                        ml="10px"
                        size="sm"
                        minWidth="32px"
                        maxWidth="80px"
                        height="32px"
                        fontWeight="semibold"
                        type="number"
                        placeholder="0"
                        value={goal}
                        onFocus={(e) => {
                            e.target.select();
                        }}
                        onChange={(e) => {
                            setGoal(e.target.value)
                        }}
                    />
                </Flex>
            </Flex>
        </ModalContainer>
    )
}