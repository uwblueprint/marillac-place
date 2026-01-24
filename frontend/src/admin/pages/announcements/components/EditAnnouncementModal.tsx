import React, { useState } from "react";
import { Text, Flex } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { UPDATE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import SelectInput from "../../../../ui/inputs/SelectInput";
import TextAreaInput from "../../../../ui/inputs/TextAreaInput";
import { Priority } from "../../../../types/enums";
import FixedInput from "../../../../ui/inputs/FixedInput";
import { toTitleCase } from "../../../../helpers/stringUtils";
import useNotification from "../../../../hooks/useNotification";

type EditAnnouncementModalProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  announcementId: number;
  sendTo: string;
  initialMessage: string;
  initialPriority: Priority;
};

const EditAnnouncementModal = ({
  setIsOpen,
  refetch,
  announcementId,
  sendTo,
  initialMessage,
  initialPriority,
}: EditAnnouncementModalProps): React.ReactElement => {
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [message, setMessage] = useState<string>(initialMessage);

  const [error, setError] = useState<string>("");
  const { sendNotification } = useNotification();
  const [editAnnouncement, { loading: editAnnouncementLoading }] =
    useMutation(UPDATE_ANNOUNCEMENT);

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

      refetch();
      setIsOpen(false);
      sendNotification("Announcement updated successfully");
    } catch (err: any) {
      setError("Unable to update announcement");
    }
  };

  return (
    <PopupContainer
      title="Edit Announcement"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={() => setIsOpen(false)}
      loading={editAnnouncementLoading}
      error_message={error}
    >
      <FixedInput
        label="Sent To"
        current_value={toTitleCase(sendTo)}
        orientation="horizontal"
      />

      <SelectInput
        label="Priority Level"
        current_value={priority}
        update_action={setPriority}
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
