import React, {useState}  from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Text,
    Input,
    ChakraProvider,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

type Props = {
    title: string,
    onSubmit: (content: any) => void,
    onDelete?: () => void,
    submitName: string,
    ModalContainerContent: any,
};

const ModalContainer = ( {title, onSubmit, submitName, ModalContainerContent, onDelete}: Props ): React.ReactElement => {
    const [content, setContent] = useState({});
    const [submitPressed, setSubmitPressed] = useState(false);
    const [isOpen, setOpen] = useState(true);

    const handleSubmit = () => {
        onSubmit(content);
        // try {
        //     setSubmitPressed(true);
        //     onSubmit(content);
        // } catch {
        //     console.log("failed to submit");
        // }
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose = {() => null}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        {title}
                        {onDelete ? (
                            <Button variant="del" onClick={onDelete}>
                                <DeleteIcon marginRight="6px"/>
                                Delete
                            </Button>
                        ) : null}
                    </ModalHeader>
                    <ModalBody>
                        <ModalContainerContent setContent={setContent} submitPressed={submitPressed}/>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant = "clear" marginRight="8px" onClick={() => setOpen(!isOpen)}>
                            Cancel
                        </Button>
                        <Button variant = "primary" onClick={handleSubmit}>
                            {submitName}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalContainer;
