import { Modal, ModalOverlay, ModalContent, ModalBody, RadioGroup, Radio, Stack, Text, Flex, Button, FormControl, FormLabel, Textarea, Input, InputLeftElement, InputGroup } from "@chakra-ui/react";
import React, { useState } from "react";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useMutation } from "@apollo/client";
import { UPDATE_MARILLAC_BUCKS } from "../../../../gql/mutations";

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
    <Modal closeOnOverlayClick={false} isOpen onClose={close} isCentered>
      <ModalOverlay/>
      <ModalContent
        boxShadow="xl"
        borderRadius="16px"
        width="450px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">Marillac Balance</Text>
          <Flex
            flexDir="column"
            gap="10px"
          >
            <Flex w="100%" alignItems="center" justifyContent="space-between">
              <Text textStyle="web.s1" color="text.light.secondary">Current Balance</Text>
              <Text
                textStyle="web.s1"
                color="primary.700"
                padding="5px 15px"
                border="1px solid"
                borderColor="neutral.300"
                borderRadius="8px"
                bg="neutral.100"
              >
                $&nbsp;{currentBalance}
              </Text>
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <FormControl w="70%">
                <FormLabel mb="5px" color="text.secondary" fontWeight="500">
                  <Text textStyle="web.s1" color="text.light.secondary">Enter Amount</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <AttachMoneyIcon fontSize="small" />
                  </InputLeftElement>
                  <Input
                    type="number"
                    textStyle="web.b1"
                    color="#000000"
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
                textStyle="web.b1"
                color="#000000"
                value={reason}
                onChange={(e: any) => setReason(e.target.value)}
              />
            </FormControl>

            { error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text> }

            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap="15px"
              mt="10px"
            >
              <Button
                variant="white"
                onClick={close}
              >
                <Text textStyle="web.s1">Cancel</Text>
              </Button>

              <Button
                variant="primaryFilled"
                onClick={ handleSubmit }
              >
                <Text textStyle="web.s1" color="white">Save</Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}