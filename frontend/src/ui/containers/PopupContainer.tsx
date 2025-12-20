import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Spinner,
} from "@chakra-ui/react";
import BlackOutlineButton from "../buttons/BlackOutlineButton";
import OrangeButton from "../buttons/OrangeButton";

type PopupContainerProps = {
  title: string;
  submit_text?: string;
  submit_action?: () => void;
  cancel_action: () => void;
  children: React.ReactNode;
  error_message?: string;
  loading?: boolean;
};

export default function PopupContainer({
  title,
  submit_text = "Save",
  submit_action,
  cancel_action,
  children,
  error_message = "",
  loading = false,
}: PopupContainerProps) {
  return (
    <Modal
      isOpen
      isCentered
      onClose={cancel_action}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        width="fit-content"
        minWidth="350px"
        maxWidth="550px"
        height="fit-content"
        boxShadow="xl"
        borderRadius="8px"
        paddingX="30px"
        paddingY="20px"
        gap="8px"
      >
        <Text textStyle="web.h3" mb="4px">
          {title}
        </Text>

        {loading ? (
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            paddingY="10px"
          >
            <Spinner size="md" color="primary.700" />
          </Flex>
        ) : error_message !== "" ? (
          <Flex flexDir="column" gap="2px" paddingY="10px">
            <Text textStyle="web.b2" color="#E30000" textAlign="center">
              ERROR
            </Text>
            <Text
              textStyle="web.b2"
              color="text.light.secondary"
              textAlign="center"
            >
              {error_message}
            </Text>
          </Flex>
        ) : (
          children
        )}

        <Flex alignItems="center" justifyContent="flex-end" gap="12px" mt="8px">
          <BlackOutlineButton
            label="Cancel"
            action={cancel_action}
            is_active={false}
          />
          {submit_action && (
            <OrangeButton
              label={submit_text}
              action={submit_action}
              is_active={false}
            />
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
}
