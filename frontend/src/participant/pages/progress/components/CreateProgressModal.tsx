import React, { useContext, useState} from "react";
import {
  Button,
  Flex,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import { useQuery } from '@apollo/client';
import { GET_MARILLAC_BUCKS } from "../../../../gql/queries";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { ParticipantContext } from '../../../../common/participant/ParticipantContext';
import ModalContainer from "../../../../admin/common/form/ModalContainer";
import CoreInput from "../../../../admin/common/form/CoreInput";

const CreateProgressModal = ({isOpen, onClose}: { isOpen: boolean, onClose: () => void }) => {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
    }
    const participant = useContext(ParticipantContext);

    const participantId = participant?.id ?? "";

    const { loading, error, data } = useQuery(GET_MARILLAC_BUCKS, {
        variables: { participantId },
        skip: !participant,
    });
    
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
                <Flex flexDirection="column" justifyContent="flex-start" gap="12px">
                    <Text textStyle="web.c3" color="text.light.primary">Previous goal:</Text>
                    <Text textStyle="web.c3" color="text.light.primary">New goal:</Text>
                </Flex>

                <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-end" textAlign="right">
                    <Flex alignItems="center" gap="8px" mb="8px">
                        <Image
                            src="/assets/marillac_bucks.png"
                            alt="$"
                            width="25px"
                            height="25px"
                            objectFit="cover"
                            borderRadius="100%"
                        />
                        <Text textStyle="mobile.h2">{data.getParticipantById.marillac_bucks}</Text>
                    </Flex>

                    <Flex alignItems="center" gap="8px" mb="8px" justifyContent="flex-end" width="100%">
                        <Image
                            src="/assets/marillac_bucks.png"
                            alt="$"
                            width="25px"
                            height="25px"
                            objectFit="cover"
                            borderRadius="100%"
                        />
                        <Box width="auto" display="flex">
                            <CoreInput 
                                label=""
                                current_value={"0"}
                                action={(e: any) => console.log(e.target.value)}
                                type="number"
                                width="40px" 
                            />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>

        </ModalContainer>
    );
};

export default CreateProgressModal;