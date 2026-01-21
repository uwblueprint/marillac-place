import { Flex, Text } from "@chakra-ui/react";
import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { ParticipantContext } from "../../../ParticipantContext";
import { UPDATE_EARNING_GOAL } from "../../../../gql/earningGoalRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import { EarningGoal } from "../../../../types/models";
import { MarillacCoin } from "../../../../ui/icons/MiscIcons";
import NumberInput from "../../../../ui/inputs/NumberInput";

interface EditGoalProps {
  handleClose: () => void;
  refetchGoal: () => void;
  currentGoal: EarningGoal;
}

export const EditGoal: React.FC<EditGoalProps> = ({
  handleClose,
  refetchGoal,
  currentGoal,
}) => {
  const { pid } = useContext(ParticipantContext);
  const [goal, setGoal] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [updateGoalMutation, { loading }] = useMutation(UPDATE_EARNING_GOAL);
  const handleSave = async () => {
    setError("");
    if (pid === -1) {
      setError("Something went wrong. Please try again.");
      return;
    }

    if (goal === null) {
      setError("Please enter a new goal");
      return;
    }

    if (goal <= currentGoal.value) {
      setError("New goal must be greater than previous goal");
      return;
    }

    try {
      await updateGoalMutation({
        variables: {
          pid,
          date: currentGoal.date,
          value: goal,
        },
      });

      refetchGoal();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to update goal — please try again.");
    }
  };

  return (
    <PopupContainer
      title="Edit Goal"
      submit_text="Save"
      submit_action={handleSave}
      cancel_action={handleClose}
      error_message={error}
      loading={loading}
    >
      <Flex justify="space-between" alignItems="center">
        <Text textStyle="mobile.b1">Previous goal:</Text>
        <Flex align="center" gap={2} justifyContent="space-between">
          <MarillacCoin size={17.5} />
          <Text textStyle="mobile.b0" mr='1px'>{currentGoal.value}</Text>
        </Flex>
      </Flex>

      <Flex justify="space-between" alignItems="center">
        <Text textStyle="mobile.b1">New goal:</Text>
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
