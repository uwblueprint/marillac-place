import React, {useState} from "react";
import {
  Button,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import {useLazyQuery, useMutation } from "@apollo/client";
import { GET_MARILLAC_BUCKS } from "../../../../gql/queries";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import ModalContainer from "../../../../admin/common/form/ModalContainer";

const CreateProgressModal = ({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) => {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
    }
    return (
        <ModalContainer
        title="Set a Goal"
        submit_text="Save"
        submit_action={handleSend}
        cancel_action={onClose}
        error={"error"}
        >
            <Flex
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <Flex flexDirection="column" justifyContent="flex-start">
                    <Text textStyle="web.c3" color="text.light.primary" marginTop="9px">Previous goal:</Text>
                    <Text textStyle="web.c3" color="text.light.primary" marginTop="9px">New goal:</Text>
                </Flex>

                <Flex flexDirection="column" justifyContent="flex-start">
                    <Text textStyle="web.c3" color="text.light.primary" marginTop="9px">Previous goal:</Text>
                    <Image
                        src="/assets/marillac_bucks.png"
                        alt="$"
                        width="25px"
                        height="25px"
                        objectFit="cover"
                        borderRadius="100%"
                    />
                </Flex>
            </Flex>

        </ModalContainer>
    );
};

export default CreateProgressModal;