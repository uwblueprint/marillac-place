import { Modal, ModalOverlay, ModalContent, ModalBody, RadioGroup, Radio, Stack, Text, Flex, Button, FormControl, FormLabel, Textarea, Input, InputLeftElement, InputGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useMutation } from "@apollo/client";
import { UPDATE_MARILLAC_BUCKS } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import SimpleButton from "../../../common/buttons/SimpleButton";

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
  close
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
        newBalance += numericAmount
      } else if (action === "remove") {
        newBalance -= numericAmount
      }
      try {
        await updateMarillacBucks({
          variables: {
            participant_id: participantId,
            marillac_bucks: newBalance,
            reason
          }
        });
      } catch (err: any) {
        setError(err.message);
      }

      localStorage.setItem("notification", "Updated Balance: $" + newBalance + " for Room " + roomNumber);
      window.location.reload();
    }
  }

  return (
    <ModalContainer
      title="Marillac Balance"
      submit_text="Save"
      submit_action={handleSubmit}
      cancel_action={close}
    >
      <Flex
        flexDir="column"
        gap="10px"
      >
        <Flex w="100%" alignItems="center" justifyContent="space-between">
          <Text textStyle="web.s1" color="text.light.secondary">Current Balance</Text>
          <SimpleButton
            text={"$ " + currentBalance}
            action={() => {}}
            is_active
            text_color="primary.700"
          />
        </Flex>

        <Flex alignItems="center" justifyContent="space-between">
          <FormControl w="70%">
            <FormLabel mb="5px" color="text.secondary" fontWeight="500">
              <Text textStyle="web.s1" color="text.light.secondary">Enter Amount</Text>
            </FormLabel>
            <InputGroup>
              <InputLeftElement>
                <AttachMoneyIcon style={{ color: 'inherit', fontSize: 15 }} />
              </InputLeftElement>
              <Input
                variant="primary"
                pl="30px"
                type="number"
                value={amount}
                onChange={(e: any) => setAmount(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <RadioGroup w="25%" mt="22px" value={action} onChange={(act: string) => setAction(act)}>
            <Stack direction='column'>
              <Radio value='add' size="sm">
                <Text textStyle="web.s1" color="text.light.secondary">Add</Text>
              </Radio>
              <Radio value='remove' size="sm">
                <Text textStyle="web.s1" color="text.light.secondary">Remove</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </Flex>

        <FormControl>
          <FormLabel mb="5px" color="text.secondary" fontWeight="500">
            <Text textStyle="web.s1" color="text.light.secondary">Reason</Text>
          </FormLabel>
          <Textarea
            variant="primary"
            value={reason}
            onChange={(e: any) => setReason(e.target.value)}
          />
        </FormControl>

        { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }
      </Flex>
    </ModalContainer>
  )
}