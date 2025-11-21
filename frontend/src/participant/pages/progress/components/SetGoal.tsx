import { Flex, Image, Input, Text } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { CREATE_EARNING_GOAL } from "../../../../gql/earningGoalRequests";
import { GoalAction } from "../../../../types/enums";
import useNotification from "../../../../hooks/useNotification";
import PopupContainer from "../../../../ui/containers/PopupContainer";

interface SetGoalProps {
  handleClose: () => void;
  onGoalSet: () => void;
}

export const SetGoal: React.FC<SetGoalProps> = ({ handleClose, onGoalSet }) => {
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const participantContext = useContext(ParticipantContext);
  const { sendNotification } = useNotification();

  const [createGoalMutation] = useMutation(CREATE_EARNING_GOAL);

  const handleSave = async () => {
    if (!participantContext?.pid) {
      setError("Not logged in");
      return;
    }

    const goalValue = parseInt(goal, 10);

    if (Number.isNaN(goalValue) || goalValue <= 0) {
      setError("Goal must be greater than 0");
      return;
    }

    try {
      await createGoalMutation({
        variables: {
          pid: participantContext.pid,
          action: GoalAction.SET,
          value: goalValue,
        },
      });

      sendNotification("Goal set successfully!");
      onGoalSet();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to save goal — please try again.");
    }
  };

  return (
    <PopupContainer
      title="Set a Goal"
      submit_text="Save"
      submit_action={handleSave}
      cancel_action={handleClose}
      error_message={error}
    >
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
    </PopupContainer>
  );
};
