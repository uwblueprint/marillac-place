import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import useNotification from "../../../../hooks/useNotification";

interface EditCustomBadgeModalProps {
  onClose: () => void;
  refetch: () => void;
  selected: any;
}

const EditCustomBadgeModal: React.FC<EditCustomBadgeModalProps> = ({
  onClose,
  selected,
  refetch,
}) => {
  const [badgeName, setBadgeName] = useState(selected.name);
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [error, setError] = useState("");
  const { sendNotification } = useNotification();
  const [updateCustomBadge, { loading: updateCustomBadgeLoading }] =
    useMutation(UPDATE_CUSTOM_BADGE);

  const handleSave = async () => {
    setError("");
    if (!badgeName || !badgeCriteria) {
      setError("All fields are required.");
      return;
    }

    try {
      await updateCustomBadge({
        variables: {
          cid: selected.cid,
          name: badgeName,
          description: badgeCriteria,
          icon: selected.icon,
        },
      });
      await refetch();
      onClose();
      sendNotification("Custom badge updated successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PopupContainer
      title="Edit Custom Badge"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={onClose}
      error_message={error}
      loading={updateCustomBadgeLoading}
    >
      <TextInput
        label="Badge Name"
        current_value={badgeName}
        update_action={setBadgeName}
        size="large"
      />
      <TextInput
        label="Badge Criteria"
        current_value={badgeCriteria}
        update_action={setBadgeCriteria}
        size="large"
      />
    </PopupContainer>
  );
};

export default EditCustomBadgeModal;
