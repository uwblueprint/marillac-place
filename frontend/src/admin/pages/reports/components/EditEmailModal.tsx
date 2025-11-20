import React, { useState, useEffect } from "react";
import { Switch, FormControl, FormLabel, Text, Flex } from "@chakra-ui/react";
import PopupContainer from "../../../../ui/containers/PopupContainer";

type Report = {
  email: string;
  weekly: boolean;
  monthly: boolean;
};

type EditEmailModalProps = {
  email: Report;
  onClose: () => void;
  onSubmit: (emailData: { email: string; weekly: boolean; monthly: boolean }) => void;
};

export default function EditEmailModal({
  email,
  onClose,
  onSubmit,
}: EditEmailModalProps) {
  const [weekly, setWeekly] = useState(email.weekly);
  const [monthly, setMonthly] = useState(email.monthly);

  useEffect(() => {
    setWeekly(email.weekly);
    setMonthly(email.monthly);
  }, [email]);

  const handleSubmit = () => {
    onSubmit({
      email: email.email,
      weekly,
      monthly,
    });
  };

  return (
    <PopupContainer
      title="Edit Email Address"
      submit_text="Save Changes"
      submit_action={handleSubmit}
      cancel_action={onClose}
    >
      <Flex flexDir="column" gap="20px">
        <FormControl>
          <Text textStyle="web.s1" color="text.light.secondary" mb="8px">
            Email Address
          </Text>
          <Text textStyle="web.b3" color="#000000">
            {email.email}
          </Text>
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
