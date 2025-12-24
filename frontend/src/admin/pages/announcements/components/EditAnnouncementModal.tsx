// TODO: Refactor this component
import React, { useState } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { UPDATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import ModalContainer from "../../../../ui/containers/PopupContainer";
import SelectionInput from "../../../../ui/inputs/SelectInput";
import TextInput from "../../../../ui/inputs/TextInput";

type EditAnnouncementModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  announcementId: number;
  sendTo: string;
  initialMessage: string;
  initialPriority: string;
};

const EditAnnouncementModal = ({
  isOpen,
  setIsOpen,
  announcementId,
  sendTo,
  initialMessage,
  initialPriority,
}: EditAnnouncementModalProps): React.ReactElement => {
  const [priority, setPriority] = useState(initialPriority);
  const [message, setMessage] = useState(initialMessage);

  const [error, setError] = useState("");

  const [editAnnouncement] = useMutation(UPDATE_ANNOUNCEMENT);

  const handleSave = async () => {
    setError("");
    if (!announcementId || !priority || !message.trim()) {
      setError("Missing fields");
      return;
    }

    try {
      await editAnnouncement({
        variables: {
          aid: announcementId,
          priority,
          message,
        },
      });

      localStorage.setItem("notification", "Announcement updated!");

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Edit error:", err);
      console.error("GraphQL error details:", err.graphQLErrors);
      console.error("Network error details:", err.networkError);
      setError("Unable to update announcement");
    }
  };

  const handleCancel = () => {
    setError("");
    setIsOpen(false);
  };

  return (
    <ModalContainer
      title="Edit Announcement"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={handleCancel}
      error_message={error}
    >
      <Flex gap="5px" align="flex-end">
        <Text textStyle="web.s1" color="text.light.secondary">
          Sent To
        </Text>
        <Text textStyle="web.b3" color="#000000">
          {sendTo}
        </Text>
      </Flex>

      <SelectionInput
        label="Priority Level"
        current_value={priority}
        update_action={(opt: string) => setPriority(opt)}
        value_options={{
          Normal: "NORMAL",
          High: "HIGH",
          Critical: "CRITICAL",
        }}
      />

      <TextInput
        label="Message"
        current_value={message}
        update_action={(value: any) => setMessage(value)}
        size="large"
      />
    </ModalContainer>
  );
};

export default EditAnnouncementModal;
