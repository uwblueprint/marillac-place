import { Text, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BALANCE } from "../../../../gql/transactionRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import FixedInput from "../../../../ui/inputs/FixedInput";
import NumberInput from "../../../../ui/inputs/NumberInput";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";

type MarillacBalanceModalProps = {
  currentBalance: number;
  participantId: number;
  close: () => void;
  refetchParticipant: () => void;
};

export default function MarillacBalanceModal({
  currentBalance,
  participantId,
  close,
  refetchParticipant,
}: MarillacBalanceModalProps) {
  const [action, setAction] = useState<"Add" | "Remove" | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const [updateMarillacBucks, { loading: updateMarillacBucksLoading }] =
    useMutation(UPDATE_BALANCE);

  async function handleSubmit() {
    setError("");
    if (!reason || amount === 0 || action === null) {
      setError("Missing fields");
    } else if (amount <= 0) {
      setError("Amount must be positive");
    } else {
      try {
        const multiplier = action === "Add" ? 1 : -1;
        await updateMarillacBucks({
          variables: {
            pid: participantId,
            amount: amount * multiplier,
            reason,
          },
        });
      } catch (err: any) {
        setError(err.message);
      }
      refetchParticipant();
      close();
    }
  }

  return (
    <PopupContainer
      title="Marillac Balance"
      submit_text="Update"
      submit_action={handleSubmit}
      cancel_action={close}
      error_message={error}
      loading={updateMarillacBucksLoading}
    >
      <FixedInput
        label="Current Balance"
        current_value={`$${currentBalance}`}
        orientation="horizontal"
      />

      <Flex width="100%" alignItems="flex-end" justifyContent="space-between">
        <NumberInput
          label="Enter Amount"
          current_value={amount}
          update_action={setAmount}
          size="small"
        />
        <SelectInput
          current_value={action}
          update_action={setAction}
          value_options={{
            Add: "Add",
            Remove: "Remove",
          }}
        />
      </Flex>

      <TextAreaInput
        label="Reason"
        current_value={reason}
        update_action={setReason}
        size="medium"
      />
    </PopupContainer>
  );
}
