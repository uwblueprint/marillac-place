import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useMutation } from "@apollo/client";
import { UPDATE_MARILLAC_BUCKS } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import SimpleButton from "../../../common/buttons/SimpleButton";
import CoreInput from "../../../common/form/CoreInput";
import SelectionInput from "../../../common/form/SelectionInput";
import TextInput from "../../../common/form/TextInput";

type MarillacBalanceModalProps = {
  currentBalance: number;
  participantId: number;
  roomNumber: number;
  close: () => void;
};

export default function MarillacBalanceModal({
  currentBalance,
  participantId,
  roomNumber,
  close,
}: MarillacBalanceModalProps) {
  const [action, setAction] = useState("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const [updateMarillacBucks] = useMutation(UPDATE_MARILLAC_BUCKS);

  async function handleSubmit() {
    setError("");
    if (!reason || !amount || !action) {
      setError("Missing fields");
      return;
    }
    const numericAmount = parseInt(amount, 10);
    if (numericAmount <= 0) {
      setError("Amount must be positive");
    } else if (numericAmount > currentBalance && action === "remove") {
      setError("Cannot remove an amount greater than the current balance");
    } else {
      let newBalance = currentBalance;
      if (action === "add") {
        newBalance += numericAmount;
      } else if (action === "remove") {
        newBalance -= numericAmount;
      }
      try {
        await updateMarillacBucks({
          variables: {
            participant_id: participantId,
            marillac_bucks: newBalance,
            reason,
          },
        });
      } catch (err: any) {
        setError(err.message);
      }

      localStorage.setItem(
        "notification",
        "Updated Balance: $" + newBalance + " for Room " + roomNumber
      );
      window.location.reload();
    }
  }

  return (
    <ModalContainer
      title="Marillac Balance"
      submit_text="Save"
      submit_action={handleSubmit}
      cancel_action={close}
      error={error}
    >
      <Flex w="100%" alignItems="center" justifyContent="space-between">
        <Text textStyle="web.s1" color="text.light.secondary">
          Current Balance
        </Text>
        <SimpleButton
          text={"$ " + currentBalance}
          action={() => {}}
          is_active
          text_color="primary.700"
        />
      </Flex>

      <Flex w="100%" alignItems="flex-end" justifyContent="center" gap="16px">
        <CoreInput
          label="Enter Amount"
          current_value={amount}
          action={(e: any) => setAmount(e.target.value)}
          type="number"
          width="100%"
        />
        <SelectionInput
          label=""
          current_value={action}
          action={(act: string) => setAction(act)}
          mode="radio"
          value_options={{
            Add: "add",
            Remove: "remove",
          }}
        />
      </Flex>

      <TextInput
        label="Reason"
        current_value={reason}
        action={(e: any) => setReason(e.target.value)}
        width="300px"
      />
    </ModalContainer>
  );
}
