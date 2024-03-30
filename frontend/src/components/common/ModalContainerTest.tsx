import React, {useState}  from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Input,
    ChakraProvider,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { HOME_PAGE } from "../../constants/Routes";

const ModalContainerTest = (): React.ReactElement => {
    return (
        <>
            <Input placeholder="hellooooo" />
        </>
    );
};

export default ModalContainerTest;
