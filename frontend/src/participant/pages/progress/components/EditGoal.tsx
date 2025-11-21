import { Flex, Image, Input, Text } from "@chakra-ui/react";
import React, { useState, useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { UPDATE_EARNING_GOAL } from "../../../../gql/earningGoalRequests";
import useNotification from "../../../../hooks/useNotification";
import PopupContainer from "../../../../ui/containers/PopupContainer";

interface EditGoalProps {
  handleClose: () => void;
  onGoalUpdated: () => void;
  currentGoal: number;
  currentBalance: number;
}

export const EditGoal: React.FC<EditGoalProps> = ({
  handleClose,
  onGoalUpdated,
  currentGoal,
  currentBalance,
}) => {
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const participantContext = useContext(ParticipantContext);
  const { sendNotification } = useNotification();

  const [updateGoalMutation] = useMutation(UPDATE_EARNING_GOAL);

  const handleSave = async () => {
    if (!participantContext?.pid) {
      setError("Not logged in");
      return;
    }

    const goalValue = parseInt(goal, 10);
    if (Number.isNaN(goalValue)) {
      setError("Please enter a valid number");
      return;
    }

    if (goalValue <= currentBalance) {
      setError("Goals must be greater than current Marillac Bucks Balance");
      return;
    }

    try {
      // Get today's date for the update
      const today = new Date();
      await updateGoalMutation({
        variables: {
          pid: participantContext.pid,
          date: today,
          value: goalValue,
        },
      });

      sendNotification("Goal updated successfully!");
      onGoalUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to update goal — please try again.");
    }
  };

  // Show previous goal value
  useEffect(() => {
    setGoal(currentGoal.toString());
  }, [currentGoal]);

  return (
    <PopupContainer
      title="Edit Goal"
      submit_text="Save"
      submit_action={handleSave}
      cancel_action={handleClose}
      error_message={error}
    >
      <Flex flexDirection="column" gap="15px">
        {/* Previous Goal */}
        <Flex justify="space-between">
          <Text textStyle="web.b1">Previous goal:</Text>
          <Flex align="center" justify="space-between">
            <Image src="/assets/marillac_bucks.png" alt="coin" />
            <Text ml="10px" fontWeight="semibold">
              {currentGoal}
            </Text>
          </Flex>
        </Flex>

        {/* New Goal */}
        <Flex justify="space-between">
          <Text textStyle="web.b1">New goal:</Text>
          <Flex align="center" justify="space-between">
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
                setGoal(e.target.value);
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </PopupContainer>
  );
};
