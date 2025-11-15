import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
} from "@chakra-ui/react";
import BlackOutlineButton from "../buttons/BlackOutlineButton";
import OrangeButton from "../buttons/OrangeButton";

type PopupContainerProps = {
  title: string;
  submit_action?: () => void;
  cancel_action: () => void;
  children: React.ReactNode;
  error_message?: string;
};

export default function PopupContainer({
  title,
  submit_action,
  cancel_action,
  children,
  error_message,
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
        paddingX="25px"
        paddingY="15px"
      >
        <Text textStyle="web.h3" mb="10px">
          {title}
        </Text>
        <Flex flexDir="column" gap="8px">
          {children}
          {error_message && (
            <Text textStyle="web.s1" color="#E30000">
              {error_message}
            </Text>
          )}
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="flex-end"
          gap="12px"
          mt="15px"
        >
          <BlackOutlineButton
            label="Cancel"
            action={cancel_action}
            is_active={false}
          />
          {submit_action && (
            <OrangeButton
              label="Submit"
              action={submit_action}
              is_active={false}
            />
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
}