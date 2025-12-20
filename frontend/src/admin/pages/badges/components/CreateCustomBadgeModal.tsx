import React, { useState } from "react";
import { Flex, Text, Grid } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import { Icon } from "../../../../types/enums";
import { ICON_MAP } from "../../../../constants/icons";

interface CreateCustomBadgeModalProps {
  onClose: () => void;
  refetch: () => void;
}

const CreateCustomBadgeModal = ({
  onClose,
  refetch,
}: CreateCustomBadgeModalProps) => {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [error, setError] = useState("");

  const availableIcons = [
    Icon.FIVE_STAR,
    Icon.GROUP,
    Icon.HEART,
    Icon.HOME,
    Icon.BABY,
    Icon.WINGS,
  ];

  const [createCustomBadge, { loading: createCustomBadgeLoading }] =
    useMutation(CREATE_CUSTOM_BADGE);

  const handleSave = async () => {
    setError("");
    if (!name || !criteria || !selectedIcon) {
      setError("Missing fields");
    } else {
      try {
        createCustomBadge({
          variables: {
            name,
            description: criteria,
            icon: selectedIcon,
          },
        });
        await refetch();
        onClose();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return (
    <PopupContainer
      title="Create Custom Badge"
      submit_text="Create Badge"
      submit_action={handleSave}
      cancel_action={() => {
        setError("");
        onClose();
      }}
      error_message={error}
      loading={createCustomBadgeLoading}
    >
      <TextInput
        label="Badge Name"
        current_value={name}
        update_action={setName}
        size="large"
      />
      <TextInput
        label="Badge Criteria"
        current_value={criteria}
        update_action={setCriteria}
        size="large"
      />

      <Text textStyle="web.s1" color="text.light.secondary">
        Choose Badge Icon
      </Text>
      <Grid templateColumns="repeat(6, 1fr)" gap={3}>
        {availableIcons.map((icon) => {
          const IconComponent = ICON_MAP[icon];
          const isSelected = selectedIcon === icon;

          return (
            <Flex
              key={icon}
              align="center"
              justify="center"
              p="8px"
              border="1px solid"
              borderColor={isSelected ? "primary.700" : "neutral.300"}
              borderRadius="8px"
              cursor="pointer"
              onClick={() => setSelectedIcon(icon)}
            >
              <IconComponent
                size={32}
                color={isSelected ? "primary.700" : "neutral.300"}
              />
            </Flex>
          );
        })}
      </Grid>
    </PopupContainer>
  );
};

export default CreateCustomBadgeModal;
