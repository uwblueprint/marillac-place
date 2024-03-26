import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    ChakraProvider,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

const ModalContainer = (): React.ReactElement => {
    const isOpen  = true;
    
    return (
        <>
            <Modal isOpen={isOpen} onClose = {() => null}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Title</ModalHeader>
                    <ModalBody>
                        hellooooo
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={}>
                            Close
                        </Button>
                        {/* hi */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalContainer;
