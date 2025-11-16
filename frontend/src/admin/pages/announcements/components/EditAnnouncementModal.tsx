import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import useNotification from "../../../../hooks/useNotification";
import { UPDATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import { Priority } from "../../../../types/enums";

type EditAnnouncementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  announcementId: number;
  sendToLabel: string;
  initialMessage: string;
  initialPriority: Priority;
  onAnnouncementUpdated: () => Promise<void>;
};

const EditAnnouncementModal = ({
  isOpen,
  onClose,
  announcementId,
  sendToLabel,
  initialMessage,
  initialPriority,
  onAnnouncementUpdated,
}: EditAnnouncementModalProps): React.ReactElement | null => {
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();

  const [updateAnnouncement, { loading }] = useMutation(UPDATE_ANNOUNCEMENT, {
    onError: (err) => setError(err.message ?? "Failed to update announcement."),
  });

  useEffect(() => {
    if (isOpen) {
      setPriority(initialPriority);
      setMessage(initialMessage);
      setError("");
    }
  }, [isOpen, initialPriority, initialMessage]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSave = async () => {
    setError("");
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }

    try {
      await updateAnnouncement({
        variables: {
          aid: announcementId,
          priority,
          message: message.trim(),
        },
      });
      await onAnnouncementUpdated();
      sendNotification("Announcement updated.");
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to update announcement.");
      }
    }
  };

  return (
    <PopupContainer
      title="Edit Announcement"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={handleClose}
      error_message={error}
      loading={loading}
    >
      <Flex gap="4px" align="flex-end">
        <Text textStyle="web.s1" color="text.light.secondary">
          Sent To
        </Text>
        <Text textStyle="web.b3" color="#000000">
          {sendToLabel}
        </Text>
      </Flex>

      <SelectInput
        label="Priority Level"
        current_value={priority}
        update_action={(value: Priority) => setPriority(value)}
        value_options={{
          Normal: Priority.NORMAL,
          High: Priority.HIGH,
          Critical: Priority.CRITICAL,
        }}
      />

      <TextAreaInput
        label="Message"
        current_value={message}
        update_action={setMessage}
        size="large"
      />
    </PopupContainer>
  );
};

export default EditAnnouncementModal;
