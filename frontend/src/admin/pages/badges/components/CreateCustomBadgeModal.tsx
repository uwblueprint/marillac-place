import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Text,
  Grid,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { Icon, iconList } from "../../../../constants/icons";
import { CREATE_CUSTOM_BADGE } from "../../../../gql/mutations";
import ModalContainer from "../../../common/form/ModalContainer";
import CoreInput from "../../../common/form/CoreInput";

interface Props {
  onClose: () => void;
}

const CreateCustomBadgeModal = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [error, setError] = useState("");

  const [createCustomBadge, { loading }] = useMutation(CREATE_CUSTOM_BADGE, {
    onCompleted: () => {
      localStorage.setItem("notification", "Created Custom Badge: " + name);
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSave = () => {
    setError("");
    if (!name || !criteria || !selectedIcon) {
      setError("Missing fields");
    } else {
      createCustomBadge({
        variables: {
          name,
          description: criteria,
          icon: selectedIcon.toUpperCase(),
        },
      });
    }
  };

  return (
    <ModalContainer
      title="Create Custom Badge"
      submit_text="Create Badge"
      submit_action={handleSave}
      cancel_action={() => {
        setError("");
        onClose();
      }}
      error={error}
    >
      <CoreInput
        label="Badge Name"
        current_value={name}
        action={(e: any) => setName(e.target.value)}
        type="text"
      />
      <CoreInput
        label="Badge Criteria"
        current_value={criteria}
        action={(e: any) => setCriteria(e.target.value)}
        type="text"
      />

      <FormControl mb={4}>
        <FormLabel>
          <Text textStyle="web.s1" color="text.light.secondary">
            Choose Badge Icon
          </Text>
        </FormLabel>
        <Grid templateColumns="repeat(6, 1fr)" gap={3}>
          {iconList.map((icon) => (
            <Flex
              key={icon}
              as="button"
              align="center"
              justify="center"
              width="64px"
              height="64px"
              p={2}
              borderRadius="8px"
              border="1px solid"
              borderColor={selectedIcon === icon ? "#3182CE" : "neutral.300"}
              bg="white"
              onClick={() => setSelectedIcon(icon)}
              _hover={{ borderColor: "#3182CE" }}
            >
              <ChakraImage
                src={`/badges/${icon}.svg`}
                alt={icon}
                boxSize={icon === Icon.WINGS ? "55px" : "32px"}
                opacity={selectedIcon === icon ? 1 : 0.5}
              />
            </Flex>
          ))}
        </Grid>
      </FormControl>
    </ModalContainer>
  );
};

export default CreateCustomBadgeModal;
