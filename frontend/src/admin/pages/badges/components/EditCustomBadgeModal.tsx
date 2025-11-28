import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import useNotification from "../../../../hooks/useNotification";

interface EditCustomBadgeModalProps {
  onClose: () => void;
  selected: {
    badge_id: number;
    name: string;
    description: string;
  };
}

const EditCustomBadgeModal: React.FC<EditCustomBadgeModalProps> = ({
  onClose,
  selected,
}) => {
  const [badgeName, setBadgeName] = useState(selected.name);
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [error, setError] = useState("");

  const { sendNotification } = useNotification();

  const [editCustomBadge] = useMutation(UPDATE_CUSTOM_BADGE, {
    onCompleted: () => {
      sendNotification("Custom badge updated");
      onClose();
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSave = () => {
    setError("");
    if (!badgeName.trim() || !badgeCriteria.trim()) {
      setError("All fields are required.");
      return;
    }

    editCustomBadge({
      variables: {
        custom_badge_id: selected.badge_id,
        new_custom_badge_name: badgeName,
        new_custom_badge_description: badgeCriteria,
      },
    });
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
