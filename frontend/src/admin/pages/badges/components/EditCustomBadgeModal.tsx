export {};
// TODO: Refactor this component
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";

interface EditCustomBadgeModalProps {
  onClose: () => void;
  selected: any;
}

const EditCustomBadgeModal: React.FC<EditCustomBadgeModalProps> = ({
  onClose,
  selected,
}) => {
  const [badgeName, setBadgeName] = useState(selected.name);
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [error, setError] = useState("");

  const [editCustomBadge] = useMutation(UPDATE_CUSTOM_BADGE);

  const handleSave = async () => {
    setError("");
    if (!badgeName || !badgeCriteria) {
      setError("All fields are required.");
      return;
    }

    try {
      await editCustomBadge({
        variables: {
          custom_badge_id: selected.badge_id,
          new_custom_badge_name: badgeName,
          new_custom_badge_description: badgeCriteria,
        },
      });
      localStorage.setItem("notification", "Custom badge updated");
      window.location.reload();
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
