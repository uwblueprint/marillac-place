// TODO: Refactor in progress - ignore for now
import React, { useState } from "react";
import { Switch, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import ModalContainer from "../../../common/form/ModalContainer";

type AddEmailModalProps = {
  onClose: () => void;
  onSubmit: (emailData: any) => void;
};

export default function AddEmailModal({
  onClose,
  onSubmit,
}: AddEmailModalProps) {
  const [email, setEmail] = useState("");
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) {
      return; // Basic validation
    }

    onSubmit({
      email: email.trim(),
      weekly,
      monthly,
      lastReportSent: "Never",
    });
  };

  return (
    <ModalContainer
      title="Add Email Address"
      submit_text="Add Email"
      submit_action={handleSubmit}
      cancel_action={onClose}
    >
      <FormControl>
        <Text textStyle="web.s1" color="text.light.secondary">
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

      <FormControl mt="20px">
        <FormLabel textStyle="web.s1" color="text.light.secondary">
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
    </ModalContainer>
  );
}
