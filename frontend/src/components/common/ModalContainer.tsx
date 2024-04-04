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
  ModalContainerContent: ({
    setOpen,
  }: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactElement;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalContainer = ({
  title,
  ModalContainerContent,
  onDelete,
  isOpen,
  setOpen,
}: Props): React.ReactElement => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => null}>
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
          <ModalBody>
            <ModalContainerContent setOpen={setOpen} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalContainer;
