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
import { Marker, Trash } from "../icons/ActionIcons";

type PopupContainerProps = {
  title: string;
  submit_text?: string;
  submit_action?: () => void;
  cancel_action: () => void;
  children: React.ReactNode;
  system_error?: boolean;
  error_message?: string;
  loading?: boolean;
  edit_action?: () => void;
  delete_action?: () => void;
};

export default function PopupContainer({
  title,
  submit_text = "Save",
  submit_action,
  cancel_action,
  children,
  system_error = false,
  error_message = "",
  loading = false,
  edit_action,
  delete_action,
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
        minWidth="300px"
        maxWidth="550px"
        height="fit-content"
        boxShadow="xl"
        borderRadius="8px"
        paddingX="30px"
        paddingY="20px"
        gap="8px"
      >
        <Flex justifyContent="space-between" alignItems="baseline">
          <Text textStyle="h3" mb="4px" mr="20px">
            {title}
          </Text>
          <Flex gap="5px">
            {edit_action && (
              <BlackOutlineButton
                label="Edit"
                action={edit_action}
                is_active={false}
                text_color="brand.primaryDark"
                icon={<Marker color="brand.primaryDark" />}
              />
            )}
            {delete_action && (
              <BlackOutlineButton
                label="Delete"
                action={delete_action}
                is_active={false}
                text_color="indicate.brightRed"
                icon={<Trash />}
              />
            )}
          </Flex>
        </Flex>

        {loading ? (
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            paddingY="10px"
          >
            <Spinner size="md" color="brand.primaryDark" />
          </Flex>
        ) : system_error ? (
          <Flex flexDir="column" gap="2px" paddingY="10px">
            <Text textStyle="s1" color="indicate.brightRed" textAlign="center">
              ERROR
            </Text>
            <Text
              textStyle="b1"
              color="text.medium"
              textAlign="center"
            >
              Something went wrong.
            </Text>
          </Flex>
        ) : (
          <>
            {children}
            {error_message && (
              <Text textStyle="b1" color="indicate.brightRed">
                {error_message}
              </Text>
            )}
          </>
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
