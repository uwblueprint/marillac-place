import React, {useState} from "react";
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
} from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import {useMutation} from "@apollo/client";
import {EDIT_ANNOUNCEMENT} from "../../../../gql/mutations";

type EditAnnouncementModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  announcementId: number;
  sendTo: string;
  initialMessage: string;
  initialPriority: string;
};

const EditAnnouncementModal = ({
  isOpen,
  setIsOpen,
  announcementId,
  sendTo,
  initialMessage,
  initialPriority,
}: EditAnnouncementModalProps): React.ReactElement => {
  const [priority, setPriority] = useState(initialPriority);
  const [message, setMessage] = useState(initialMessage);

  const [error, setError] = useState("");

  const [editAnnouncement] = useMutation(EDIT_ANNOUNCEMENT);

  const handleSave = async () => {
    setError("");
    if (!announcementId || !priority || !message.trim()) {
      setError("Missing fields");
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

      localStorage.setItem("notification", "Announcement updated!");

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Edit error:", err);
      console.error("GraphQL error details:", err.graphQLErrors);
      console.error("Network error details:", err.networkError);
      setError("Unable to update announcement");
    }

  };

  const handleCancel = () => {
    setError("");
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="md" isCentered>
      <ModalOverlay/>
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
          {error && <Text textStyle="web.b2" fontWeight="600" color="#E30000">{error}</Text>}
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
