import React, { useState } from "react";
import { Switch, FormControl, FormLabel, Text, Flex } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import { CREATE_REPORT_RECIPIENT } from "../../../../gql/reportRecipientRequests";
import ToggleButton from "../../../../ui/buttons/ToggleButton";

type AddEmailModalProps = {
  refetch: () => void;
  onClose: () => void;
};

export default function AddEmailModal({
  refetch,
  onClose,
}: AddEmailModalProps) {
  const [email, setEmail] = useState<string>("");
  const [weekly, setWeekly] = useState<boolean>(false);
  const [monthly, setMonthly] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [createReportRecipient, { loading: createReportRecipientLoading }] =
    useMutation(CREATE_REPORT_RECIPIENT);
  const handleAddEmail = async (
    new_email: string,
    send_weekly: boolean,
    send_monthly: boolean
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      await createReportRecipient({
        variables: {
          email: new_email,
          weekly: send_weekly,
          monthly: send_monthly,
        },
      });
      onClose();
      refetch();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PopupContainer
      title="Add Email Address"
      submit_text="Add Email"
      submit_action={() => handleAddEmail(email, weekly, monthly)}
      cancel_action={onClose}
      error_message={error}
      loading={createReportRecipientLoading}
    >
      <TextInput
        label="Email Address"
        current_value={email}
        update_action={setEmail}
        size="large"
      />
      <Text textStyle="web.s1" color="text.light.secondary">
        Report Frequency
      </Text>
      <Flex w="100%" alignItems="center" gap="15px">
        <Text textStyle="web.b3" color="text.light.primary" w="95px">
          Weekly Reports
        </Text>
        <ToggleButton active={weekly} setActive={setWeekly} />
      </Flex>
      <Flex w="100%" alignItems="center" gap="15px">
        <Text textStyle="web.b3" color="text.light.primary" w="95px">
          Monthly Reports
        </Text>
        <ToggleButton active={monthly} setActive={setMonthly} />
      </Flex>
    </PopupContainer>
  );
}
