import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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

// Enum for badge icon options
export enum Icon {
  FIVE_STAR = "five_star",
  FOUR_STAR = "four_star",
  GROUP = "group",
  HEART = "heart",
  HOME = "home",
  BABY = "baby",
  WINGS = "wings",
  FLOWER = "flower",
  MONEY = "money",
  GEMSTONE = "gemstone",
  DIAMOND = "diamond",
  PENCIL = "pencil",
  TOOL = "tool",
}

const iconList = [
  Icon.FIVE_STAR,
  Icon.GROUP,
  Icon.HEART,
  Icon.HOME,
  Icon.BABY,
  Icon.WINGS,
];


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; criteria: string; icon: Icon }) => void;
}

const CreateCustomBadgeModal = ({ isOpen, onClose, onSave }: Props) => {
  const [name, setName] = useState("");
  const [criteria, setCriteria] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);

  const handleSave = () => {
    if (name && criteria && selectedIcon) {
      onSave({ name, criteria, icon: selectedIcon });
      onClose();
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="16px" p={6} maxW="600px">
        <ModalHeader>
          <Text textStyle="web.h3">Create New Custom Badge</Text>
        </ModalHeader>

        <ModalBody>
          <FormControl mb={8}>
            <FormLabel>
              <Text textStyle="web.s1" fontSize="l" color="text.light.secondary">Badge Name</Text>
            </FormLabel>
            <Input
              placeholder="Enter Badge Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>
              <Text textStyle="web.s1" fontSize="l" color="text.light.secondary">Badge Criteria</Text>
            </FormLabel>
            <Input
              placeholder="Enter Badge Criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
  <FormLabel>
    <Text textStyle="web.s1" fontSize="l" color="text.light.secondary">Choose Badge Icon</Text>
  </FormLabel>
  <Grid templateColumns="repeat(6, 1fr)" gap={3}>
    {iconList.map((icon) => (
      <Flex
        key={icon}
        as="button"
        align="center"
        justify="center"
        width="72px"
        height="72px"
        p={2}
        borderRadius="8px"
        border="2px solid"
        borderColor={selectedIcon === icon ? "#3182CE" : "gray.200"}
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


          <Flex alignItems="center" justify="flex-end" gap={3} mt={4}>
            <Button
                variant="white"
                onClick={onClose}
                borderRadius="8px"
                paddingX="10px"
                paddingY="6px"
                minH="30px"
                minW="100px"
            >
                <Text fontSize="sm" textStyle="web.s1">Cancel</Text>
            </Button>

            <Button
                variant="primaryFilled"
                onClick={handleSave}
                isDisabled={!name || !criteria || !selectedIcon}
                borderRadius="8px"
                paddingX="10px"
                paddingY="6px"
                minH="30px"
                minW="100px"
            >
                <Text fontSize="sm" textStyle="web.s1" color="white">Save</Text>
            </Button>
            </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateCustomBadgeModal;
