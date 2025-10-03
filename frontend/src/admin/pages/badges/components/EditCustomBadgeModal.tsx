import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  FormControl,
  Text,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
} from "@chakra-ui/react";
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
<<<<<<< HEAD
      <Flex flexDir="column" gap="10px">
        <FormControl>
          <FormLabel mb="5px">
            <Text textStyle="web.s1" color="text.light.secondary">
              Badge Name
            </Text>
          </FormLabel>
          <Input
            variant="primary"
            value={badgeName}
            onChange={(e) => setBadgeName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel mb="5px">
            <Text textStyle="web.s1" color="text.light.secondary">
              Badge Criteria
            </Text>
          </FormLabel>
          <Input
            variant="primary"
            value={badgeCriteria}
            onChange={(e) => setBadgeCriteria(e.target.value)}
          />
        </FormControl>

        {error && (
          <Text textStyle="web.b2" fontWeight="600" color="#E30000">
            {error}
          </Text>
        )}
      </Flex>
=======
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
>>>>>>> dev
    </ModalContainer>
  );
};

export default EditCustomBadgeModal;
