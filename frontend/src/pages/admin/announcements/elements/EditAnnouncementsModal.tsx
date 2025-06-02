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
        borderRadius="2xl"
        px={5}
        pt={5}
        pb={3}
        maxW="650px"
        w="100%"
      >
        <ModalHeader
          fontSize="lg"
          fontWeight="bold"
          mb={2}
          color="gray.700"
          fontFamily="body"
        >
          Edit Announcement
        </ModalHeader>
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold" fontSize="md" color="gray.700" fontFamily="body">
              Sent To:{" "}
              <Text
                as="span"
                fontWeight="normal"
                fontSize="md"
                color="gray.900"
                fontFamily="body"
              >
                {sendTo}
              </Text>
            </Text>
          </Box>

          <FormControl mb={4}>
            <FormLabel
              fontWeight="bold"
              fontSize="md"
              color="gray.700"
              fontFamily="body"
            >
              Priority Level:
            </FormLabel>
            <RadioGroup
              onChange={setPriority}
              value={priority}
              fontSize="md"
              color="gray.700"
              fontFamily="body"
            >
              <Stack direction="column" spacing={3}>
                <Radio
                  value="normal"
                  sx={{
                    "& .chakra-radio__control[data-checked]": {
                      bg: "teal.500",
                      borderColor: "teal.500",
                    },
                    "& .chakra-radio__control[data-checked]::after": {
                      content: "''",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bg: "teal.500",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                  }}
                >
                  Normal
                </Radio>

                <Radio
                  value="high"
                  sx={{
                    "& .chakra-radio__control[data-checked]": {
                      bg: "teal.500",
                      borderColor: "teal.500",
                    },
                    "& .chakra-radio__control[data-checked]::after": {
                      content: "''",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bg: "teal.500",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                  }}
                >
                  <Flex align="center" fontFamily="body">
                    High{" "}
                    <PriorityHighOutlined
                      style={{
                        marginLeft: 4,
                        color: "red",
                        fontSize: "1.3rem", // adjusted to match critical icon size
                      }}
                    />
                  </Flex>
                </Radio>

                <Radio
                  value="critical"
                  sx={{
                    "& .chakra-radio__control[data-checked]": {
                      bg: "teal.500",
                      borderColor: "teal.500",
                    },
                    "& .chakra-radio__control[data-checked]::after": {
                      content: "''",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bg: "teal.500",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    },
                  }}
                >
                  <Flex align="center" fontFamily="body">
                    Critical{" "}
                    <Box
                      as="span"
                      ml={2}
                      color="red"
                      fontWeight="bold"
                      fontSize="1.3rem"
                    >
                      !!
                    </Box>
                  </Flex>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel
              fontWeight="bold"
              fontSize="md"
              color="gray.700"
              fontFamily="body"
            >
              Message
            </FormLabel>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="md"
              minHeight="150px"
              resize="none"
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
              fontSize="md"
              fontWeight="normal"
              color="gray.900"
              fontFamily="body"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter mt={2}>
          <Flex justify="flex-end" w="100%">
            <Button
              variant="outline"
              borderColor="gray.400"
              onClick={handleCancel}
              mr={3}
              fontFamily="body"
            >
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleSave}
              fontWeight="semibold"
              fontFamily="body"
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
