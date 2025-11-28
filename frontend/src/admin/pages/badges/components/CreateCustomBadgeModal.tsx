import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Flex,
  Text,
  Grid,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { Icon } from "../../../../types/enums";
import * as BadgeIconSet from "../../../../ui/icons/BadgeIcons";
import { CREATE_CUSTOM_BADGE } from "../../../../gql/customBadgeRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import useNotification from "../../../../hooks/useNotification";

interface Props {
  onClose: () => void;
}

const badgeIconComponents: Record<Icon, React.FC<any>> = {
  [Icon.BABY]: BadgeIconSet.Baby,
  [Icon.DIAMOND]: BadgeIconSet.Diamond,
  [Icon.MONEY]: BadgeIconSet.DollarSign,
  [Icon.FIVE_STAR]: BadgeIconSet.FiveStar,
  [Icon.FLOWER]: BadgeIconSet.Flower,
  [Icon.FOUR_STAR]: BadgeIconSet.FourStar,
  [Icon.GROUP]: BadgeIconSet.Group,
  [Icon.HEART]: BadgeIconSet.Heart,
  [Icon.GEMSTONE]: BadgeIconSet.Hexagon,
  [Icon.HOME]: BadgeIconSet.Home,
  [Icon.PENCIL]: BadgeIconSet.Pencil,
  [Icon.PLANT]: BadgeIconSet.Plant,
  [Icon.TOOL]: BadgeIconSet.Tools,
  [Icon.WINGS]: BadgeIconSet.Wings,
};

const iconList = Object.values(Icon);

const CreateCustomBadgeModal = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [error, setError] = useState<string>("");

  const { sendNotification } = useNotification();

  const [createCustomBadge] = useMutation(CREATE_CUSTOM_BADGE, {
    onCompleted: () => {
      sendNotification(`Created Custom Badge: ${name}`);
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSave = () => {
    setError("");

    if (!name || !criteria || !selectedIcon) {
      setError("Missing fields");
      return;
    }

    createCustomBadge({
      variables: {
        name,
        description: criteria,
        icon: selectedIcon.toUpperCase(),
      },
    });
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
    >
      <TextInput
        label="Badge Name"
        current_value={name}
        update_action={(value: string) => setName(value)}
        size="small"
      />

      <TextInput
        label="Badge Criteria"
        current_value={criteria}
        update_action={(value: string) => setCriteria(value)}
        size="small"
      />

      <FormControl mb={4}>
        <FormLabel>
          <Text textStyle="web.s1" color="text.light.secondary">
            Choose Badge Icon
          </Text>
        </FormLabel>

        <Grid templateColumns="repeat(6, 1fr)" gap={3}>
          {iconList.map((icon) => {
            const IconComponent = badgeIconComponents[icon];

            return (
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
                <IconComponent
                  size={icon === Icon.WINGS ? 55 : 32}
                  opacity={selectedIcon === icon ? 1 : 0.5}
                />
              </Flex>
            );
          })}
        </Grid>
      </FormControl>
    </PopupContainer>
  );
};

export default CreateCustomBadgeModal;
