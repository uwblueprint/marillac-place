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
  ModalOverlay
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { EDIT_CUSTOM_BADGE } from "../../../../gql/mutations";

interface EditCustomBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: any
}

const EditCustomBadgeModal: React.FC<EditCustomBadgeModalProps> = ({ isOpen, onClose, selected }) => {
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
          new_custom_badge_description: badgeCriteria
        }
      });
      localStorage.setItem("notification", "Custom badge updated");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent boxShadow="xl" borderRadius="16px" width="450px" padding="20px">
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">Edit Custom Badge</Text>

          <Flex flexDir="column" gap="10px">
            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">Badge Name</Text>
              </FormLabel>
              <Input
                variant="primary"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">Badge Criteria</Text>
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

            <Flex alignItems="center" justifyContent="flex-end" gap="5px" mt="15px">
              <Button variant="white" onClick={onClose}>
                <Text textStyle="web.s1">Cancel</Text>
              </Button>
              <Button variant="primaryFilled" onClick={handleSave}>
                <Text textStyle="web.s1" color="white">Save</Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditCustomBadgeModal;
