import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";

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
          cid: selected.badge_id,
          name: badgeName,
          description: badgeCriteria,
          icon: selected.icon,
        },
      });
      await refetch();
      onClose();
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
        update_action={(e: any) => setBadgeName(e.target.value)}
        size="medium"
      />
      <TextInput
        label="Badge Criteria"
        current_value={badgeCriteria}
        update_action={(e: any) => setBadgeCriteria(e.target.value)}
        size="medium"
      />
    </PopupContainer>
  );
};

export default EditCustomBadgeModal;
