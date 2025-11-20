import React, { useState } from "react";
import { Switch, FormControl, FormLabel, Input, Text, Flex } from "@chakra-ui/react";
import PopupContainer from "../../../../ui/containers/PopupContainer";

type AddEmailModalProps = {
  onClose: () => void;
  onSubmit: (emailData: { email: string; weekly: boolean; monthly: boolean }) => void;
};

export default function AddEmailModal({
  onClose,
  onSubmit,
}: AddEmailModalProps) {
  const [email, setEmail] = useState("");
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    onSubmit({
      email: email.trim(),
      weekly,
      monthly,
    });
  };

  return (
    <PopupContainer
      title="Add Email Address"
      submit_text="Add Email"
      submit_action={handleSubmit}
      cancel_action={onClose}
      error_message={error}
    >
      <Flex flexDir="column" gap="20px">
        <FormControl>
          <Text textStyle="web.s1" color="text.light.secondary" mb="8px">
            Email Address
          </Text>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="100%"
            height="32px"
            paddingX="12px"
            paddingY="8px"
            border="1px"
            borderColor="#C5C8D8"
            borderRadius="8px"
            fontFamily="Nunito"
            fontWeight="400"
            fontSize="12px"
            color="#000000"
            _focus={{
              borderColor: "#C5C8D8",
              boxShadow: "none",
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel textStyle="web.s1" color="text.light.secondary" mb="10px">
            Report Frequency
          </FormLabel>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt="10px"
          >
            <FormLabel textStyle="web.b3" color="#000000" mb="0">
              Weekly Reports
            </FormLabel>
            <Switch
              isChecked={weekly}
              onChange={(e) => setWeekly(e.target.checked)}
              colorScheme="blue"
            />
          </FormControl>
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt="10px"
          >
            <FormLabel textStyle="web.b3" color="#000000" mb="0">
              Monthly Reports
            </FormLabel>
            <Switch
              isChecked={monthly}
              onChange={(e) => setMonthly(e.target.checked)}
              colorScheme="blue"
            />
          </FormControl>
        </FormControl>
      </Flex>
    </PopupContainer>
  );
}
