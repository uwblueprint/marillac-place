import React, {useState, useEffect}  from "react";
import {
    Text,
    Input,
    ChakraProvider,
    Textarea,
    Flex,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage
} from '@chakra-ui/react';

type Props = {
    setContent: any,
    submitPressed: boolean
};

const ParticipantsModal = ({setContent, submitPressed}: Props): React.ReactElement => {
    const [participant, setParticipant] =  useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        ID: 0, 
        password: '',
        arrivalDate: '',
        departureDate: '',
        notes: '',
    });

    useEffect(() => {
        console.log(participant);
        setContent(participant); 
        // /if (!participant.firstName || !participant.lastName || !participant.email || !participant.ID || !participant.password) {
        //     throw new Error("Fields missing from participants.");
        // } else {
        // }
    }, [submitPressed])

    const handleFirstNameChange = (e: any) => {setParticipant({...participant, firstName: e.target.value})};
    const handleLastNameChange = (e: any) => {setParticipant({...participant, lastName: e.target.value})};
    const handleEmailChange = (e: any) => {setParticipant({...participant, email: e.target.value})};
    const handlePhoneNumberChange = (e: any) => {setParticipant({...participant, phoneNumber: e.target.value})};
    const handleIDChange = (e: any) => {setParticipant({...participant, ID: e.target.value})};
    const handlePasswordChange = (e: any) => {setParticipant({...participant, password: e.target.value})};
    const handleArrivalChange = (e: any) => {setParticipant({...participant, arrivalDate: e.target.value})};
    const handleDepartureChange = (e: any) => {setParticipant({...participant, departureDate: e.target.value})};
    const handleNotesChange = (e: any) => {setParticipant({...participant, notes: e.target.value})};
    
    const errorMessage = "Field is required";
    return (
        <>
            <Flex flexDirection="column" gap="20px">
                <Flex gap='20px'>
                    <Flex flexDir="column" flex="1">
                        <FormControl isRequired>
                            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">First name</FormLabel>
                            <Input variant="primary" value = {participant.firstName} onChange = {handleFirstNameChange} />
                            {/* {(participant.firstName === '')? (
                                <FormErrorMessage>errorMessage</FormErrorMessage>
                            ) : (null)} */}
                        </FormControl>
                    </Flex>

                    <Flex flexDir="column" flex="1">
                        <FormControl isRequired>
                            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Last name</FormLabel>
                            <Input variant="primary" value={participant.firstName} onChange={handleLastNameChange}/>
                        </FormControl>
                    </Flex>
                </Flex>

                <Flex>
                    <FormControl isRequired>
                        <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Email</FormLabel>
                        <Input variant="primary" type="email" value={participant.email} onChange={handleEmailChange} />
                        {/* {!isError ? (
                            null
                        ) : (
                            <FormErrorMessage>Email is required.</FormErrorMessage>
                        )} */}
                    </FormControl>
                </Flex>

                <Flex>
                    <FormControl isRequired>
                        <FormLabel marginBottom="5px" color="#626262" fontWeight="700">ID</FormLabel>
                        <Input variant="primary" type="email" value={participant.ID} onChange={handleIDChange} />
                    </FormControl>
                </Flex>

                <Flex>
                    <FormControl isRequired>
                        <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Password</FormLabel>
                        <Input variant="primary" type="email" value={participant.password} onChange={handlePasswordChange} />
                    </FormControl>
                </Flex>

                <Flex>
                    <FormControl isRequired>
                        <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Phone Number</FormLabel>
                        <Input variant="primary" value={participant.phoneNumber} onChange={handlePhoneNumberChange} />
                    </FormControl>
                </Flex>

                <Flex gap='20px'>
                    <Flex flexDir="column" flex="1">
                        <FormControl>
                            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Arrival Date</FormLabel>
                            <Input variant="primary" value={participant.arrivalDate} onChange={handleArrivalChange} />
                        </FormControl>
                    </Flex>

                    <Flex flexDir="column" flex="1">
                        <FormControl>
                            <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Departure Date</FormLabel>
                            <Input variant="primary" value={participant.departureDate} onChange={handleDepartureChange}/>
                        </FormControl>
                    </Flex>
                </Flex>
                
                <Flex>
                    <FormControl>
                        <FormLabel marginBottom="5px" color="#626262" fontWeight="700">Notes</FormLabel>
                        <Textarea variant="primary" value={participant.notes} onChange={handleNotesChange}/>
                    </FormControl>
                </Flex>
            </Flex>
        </>
    );
};

export default ParticipantsModal;
