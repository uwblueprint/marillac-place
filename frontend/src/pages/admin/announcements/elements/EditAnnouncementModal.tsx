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
} from "@chakra-ui/react";
import { PriorityHighOutlined } from "@mui/icons-material";

type EditAnnouncementModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditAnnouncementModal = ({
  isOpen,
  setIsOpen,
}: EditAnnouncementModalProps): React.ReactElement => {
  const [priority, setPriority] = useState("normal");
  const [sendTo] = useState("Room 3");
  const [message, setMessage] = useState(
    "Reminding you about your meeting this Saturday! Please be on time, we will be beginning promptly at 10:30am. If you are unable to attend, please let us know as soon as possible. Have a great rest of the week everyone!"
  );

  const handleSave = () => {
    console.log("Saving announcement:", { sendTo, priority, message });
    setIsOpen(false);
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
        maxW="650px"
        w="100%"
      >
        <ModalHeader>
          <Text textStyle="web.h3">Edit Announcement</Text>
        </ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Text textStyle="web.s1" color="text.light.secondary" fontSize="16px">
              Sent To:{" "}
              <Text
                as="span"
                textStyle="web.b1"
              >
                {sendTo}
              </Text>
            </Text>
          </Box>

          <FormControl mb={4}>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary" fontSize="16px">Priority Level:</Text>
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
                  <Text textStyle="web.b1">Normal</Text>
                </Radio>

                <Radio value="HIGH">
                  <Flex align="center" fontFamily="body">
                    <Text textStyle="web.b1">
                      High{" "}
                      <Text
                        as="span"
                        ml={2}
                        color="#D34C5C"
                        fontWeight="bold"
                        fontSize="1rem"
                      >
                        !
                      </Text>
                    </Text>
                  </Flex>
                </Radio>

                <Radio value="CRITICAL">
                  <Flex align="center" fontFamily="body">
                    <Text textStyle="web.b1">
                    Critical{" "}
                      <Text
                        as="span"
                        ml={2}
                        color="#D34C5C"
                        fontWeight="bold"
                        fontSize="1rem"
                      >
                        !&nbsp;!
                      </Text>
                    </Text>
                  </Flex>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>
              <Text textStyle="web.s1" color="text.light.secondary" fontSize="16px">Message</Text>
            </FormLabel>
            <Textarea
              value={message}
              variant="primary"
              onChange={(e) => setMessage(e.target.value)}
              minHeight="150px"
              fontSize="16px"
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
              Cancel
            </Button>
            <Button
              variant="primaryFilled"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAnnouncementModal;
