import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  title: string;
  onDelete?: () => void;
  children: React.ReactNode;
};

const ModalContainer = ({
  title,
  onDelete,
  children,
}: Props): React.ReactElement => {
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen
      onClose={() => {}}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title}
          {onDelete &&
            <Button variant="del" gap="2px" onClick={onDelete}>
              <DeleteOutlinedIcon />
              Delete
            </Button>}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
