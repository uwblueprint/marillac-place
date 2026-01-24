import { Flex, Text } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { CREATE_EARNING_GOAL } from "../../../../gql/earningGoalRequests";
import { GoalAction } from "../../../../types/enums";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import { MarillacCoin } from "../../../../ui/icons/MiscIcons";
import NumberInput from "../../../../ui/inputs/NumberInput";

interface SetGoalProps {
  handleClose: () => void;
  refetchGoal: () => void;
  prevGoal: number;
}

export const SetGoal: React.FC<SetGoalProps> = ({ handleClose, refetchGoal, prevGoal }) => {
  const [goal, setGoal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const { pid } = useContext(ParticipantContext);

  const [createGoalMutation, { loading }] = useMutation(CREATE_EARNING_GOAL);
  const handleSave = async () => {
    if (pid === -1) {
      setError("Something went wrong. Please try again.");
      return;
    }

    if (goal === null) {
      setError("Please enter a new goal");
      return;
    }

    if (goal <= prevGoal) {
      setError("New goal must be greater than previous goal");
      return;
    }

    try {
      await createGoalMutation({
        variables: {
          pid,
          action: GoalAction.SET,
          value: goal,
        },
      });

      refetchGoal();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to save goal — please try again.");
    }
  };

  return (
    <PopupContainer
      title="Set Goal"
      submit_text="Save"
      submit_action={handleSave}
      cancel_action={handleClose}
      error_message={error}
      loading={loading}
    >
      <Flex justify="space-between" alignItems="center">
        <Text textStyle="b1">New Goal:</Text>
        <Flex align="center" gap={2} justifyContent="space-between" mr="-4px">
          <MarillacCoin size={22} />
          <NumberInput
            current_value={goal}
            update_action={setGoal}
            size="small"
          />
        </Flex>
      </Flex>
    </PopupContainer>
  );
};
