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

type Props = {
  title: string;
  onDelete?: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const ModalContainer = ({
  title,
  onDelete,
  isOpen,
  setIsOpen,
  children,
}: Props): React.ReactElement => {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title}
          {onDelete ? (
            <Button variant="del" gap="2px" onClick={onDelete}>
              <DeleteOutlinedIcon />
              Delete
            </Button>
          ) : null}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
