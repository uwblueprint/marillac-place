import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_CUSTOM_BADGE } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import CoreInput from "../../../common/form/CoreInput";

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

  const [editCustomBadge] = useMutation(EDIT_CUSTOM_BADGE);

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
    <ModalContainer
      title="Edit Custom Badge"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={onClose}
      error={error}
    >
      <CoreInput
        label="Badge Name"
        current_value={badgeName}
        action={(e: any) => setBadgeName(e.target.value)}
        type="text"
        width="350px"
      />
      <CoreInput
        label="Badge Criteria"
        current_value={badgeCriteria}
        action={(e: any) => setBadgeCriteria(e.target.value)}
        type="text"
        width="350px"
      />
    </ModalContainer>
  );
};

export default EditCustomBadgeModal;
