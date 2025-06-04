import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
  Box,
  useToast
} from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import { useMutation } from "@apollo/client";
import { EDIT_ANNOUNCEMENT } from "../../../../gql/mutations";


type EditAnnouncementModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  announcementId: number;
  initialMessage: string;
  initialPriority: string;
};

const EditAnnouncementModal = ({
  isOpen,
  setIsOpen,
  announcementId,
  initialMessage,
  initialPriority,
}: EditAnnouncementModalProps): React.ReactElement => {
  const [priority, setPriority] = useState(initialPriority);
  const [sendTo] = useState("");
  const [message, setMessage] = useState(initialMessage);

  const [editAnnouncement] = useMutation(EDIT_ANNOUNCEMENT);
  const toast = useToast();

  const handleSave = async () => {

    if (!announcementId || !priority || !message.trim()) {
      toast({
        title: "Missing Fields",
        description: "All fields must be filled in.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      await editAnnouncement({
        variables: {
          announcement_id: announcementId,
          priority,
          message,
        },
      });

      toast({
        title: "Success",
        description: "Announcement updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      window.location.reload();
  } catch (error: any) {
    console.error("Edit error:", error);
    console.error("GraphQL error details:", error.graphQLErrors);
    console.error("Network error details:", error.networkError);

    toast({
      title: "Error",
      description: "Failed to update announcement.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
}

  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="md" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="8px"
        px={5}
        py={5}
        maxW="550px"
        w="100%"
      >
        <ModalHeader>
          <Text textStyle="web.h3">Edit Announcement</Text>
        </ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Text textStyle="web.s1" color="text.light.secondary">
              Sent To:{" "}
              <Text
                as="span"
                textStyle="web.b1"
                fontSize="12px"
              >
                {sendTo}
              </Text>
            </Text>
          </Box>

          <FormControl mb={4}>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary">Priority Level:</Text>
            </FormLabel>
            <RadioGroup
              onChange={setPriority}
              value={priority}
              fontSize="md"
              color="gray.700"
              fontFamily="body"
            >
              <Stack direction="column" spacing={3}>
                <Radio value="NORMAL">
                  <Text textStyle="web.b1" fontSize="12px">Normal</Text>
                </Radio>

                <Radio value="HIGH">
                  <Flex align="center" fontFamily="body" gap="5px">
                    <Text textStyle="web.b1" fontSize="12px">High</Text>
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                  </Flex>
                </Radio>

                <Radio value="CRITICAL">
                  <Flex align="center" fontFamily="body" gap="5px">
                    <Text textStyle="web.b1" fontSize="12px">Critical</Text>
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                    <PriorityHighOutlinedIcon
                      sx={{
                        fontSize: "12px",
                        color: "#d34c5c",
                      }}
                    />
                  </Flex>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary">Message</Text>
            </FormLabel>
            <Textarea
              value={message}
              variant="primary"
              onChange={(e) => setMessage(e.target.value)}
              minHeight="120px"
              fontSize="12px"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            gap="15px"
          >
            <Button
              variant="white"
              onClick={handleCancel}
            >
              <Text textStyle="web.s1">Cancel</Text>
            </Button>
            <Button
              variant="primaryFilled"
              onClick={handleSave}
            >
              <Text textStyle="web.s1" color="white">Save Changes</Text>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAnnouncementModal;
