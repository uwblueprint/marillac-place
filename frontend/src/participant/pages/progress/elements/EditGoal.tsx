import { Button, Flex, Image, Input, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import ModalContainer from '../../../../admin/common/form/ModalContainer';

interface EditGoalProps {
    handleClose: () => void
    error: string | undefined
}

export const EditGoal: React.FC<EditGoalProps> = ({handleClose, error}) => {
    const [goal, setGoal] = useState("")

    const handleSave = () => {
        // add logic below for saving the goal info

        handleClose()
    }

    return (
        <ModalContainer
            title="Edit Goal"
            submit_text="Save"
            submit_action={handleSave}
            cancel_action={handleClose}
            error={error}
        >
            <Flex justify="space-between">
                <Text textStyle="web.b1">Change goal:</Text>
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