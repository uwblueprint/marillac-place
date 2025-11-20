import React, { useState } from "react";
import { Switch, FormControl, FormLabel, Flex } from "@chakra-ui/react";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";

type AddEmailModalProps = {
  onClose: () => void;
  onSubmit: (emailData: {
    email: string;
    weekly: boolean;
    monthly: boolean;
  }) => void;
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
        <TextInput
          label="Email Address"
          current_value={email}
          update_action={setEmail}
          size="full"
        />

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
            <FormLabel textStyle="web.b3" color="text.light.primary" mb="0">
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
            <FormLabel textStyle="web.b3" color="text.light.primary" mb="0">
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
