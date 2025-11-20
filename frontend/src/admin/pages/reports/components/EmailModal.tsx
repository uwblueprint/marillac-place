// Email Modal for adding AND editing email addresses
import React, { useEffect, useState } from "react";
import { Switch, FormControl, FormLabel, Text, Flex } from "@chakra-ui/react";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

type EmailModalProps = {
  // If initialData is provided, we are in edit mode
  initialData?: Report;
  onClose: () => void;
  onSubmit: (emailData: {
    email: string;
    weekly: boolean;
    monthly: boolean;
  }) => void;
};

export default function EmailModal({
  initialData,
  onClose,
  onSubmit,
}: EmailModalProps) {
  const isEditMode = Boolean(initialData);

  // Initialize the state based on mode
  const [email, setEmail] = useState(initialData?.email || "");
  const [weekly, setWeekly] = useState(initialData?.weekly || false);
  const [monthly, setMonthly] = useState(initialData?.monthly || false);
  const [error, setError] = useState("");

  // Update the state when initialData changes
  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setWeekly(initialData.weekly);
      setMonthly(initialData.monthly);
    }
  }, [initialData]);

  const handleSubmit = () => {
    setError("");

    // Only validate email in add mode (edit mode email is read-only)
    if (!isEditMode) {
      if (!email.trim()) {
        setError("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address");
        return;
      }
    }

    onSubmit({
      email: isEditMode && initialData ? initialData.email : email.trim(),
      weekly,
      monthly,
    });
  };

  return (
    <PopupContainer
      title={isEditMode ? "Edit Email Address" : "Add Email Address"}
      submit_text={isEditMode ? "Save Changes" : "Add Email"}
      submit_action={handleSubmit}
      cancel_action={onClose}
      error_message={error}
    >
      <Flex flexDir="column" gap="20px">
        {isEditMode ? (
          // Edit mode: show email as read-only text
          <FormControl>
            <Text textStyle="web.s1" color="text.light.secondary" mb="8px">
              Email Address
            </Text>
            <Text textStyle="web.b3" color="text.light.primary">
              {initialData?.email}
            </Text>
          </FormControl>
        ) : (
          // Add mode: show email input
          <TextInput
            label="Email Address"
            current_value={email}
            update_action={setEmail}
            size="full"
          />
        )}

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
