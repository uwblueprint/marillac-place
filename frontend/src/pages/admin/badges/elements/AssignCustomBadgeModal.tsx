import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  Flex,
  FormControl,
  FormLabel,
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  extendTheme,
  ChakraProvider,
} from '@chakra-ui/react';
import { ROOM_NUMBERS } from '../../../../constants/rooms';


interface CustomBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const CustomBadgeModal: React.FC<CustomBadgeModalProps> = ({ isOpen, onClose }) => {
  const [badgeName, setBadgeName] = useState('');
  const [badgeValue, setBadgeValue] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);


  const toggleRoomSelection = (room: number) => {
    setSelectedRooms((prev) =>
      prev.includes(room)
        ? prev.filter((r) => r !== room)
        : [...prev, room]
    );
  };

  const assignBadge = () => {
    console.log('Badge Assigned:', {
      badgeName,
      badgeValue,
      selectedRooms,
    });
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent boxShadow="xl" borderRadius="16px" width="450px" padding="20px">
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">Assign Custom Badge</Text>
          <Flex flexDir="column" gap="10px">
            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">Badge Name</Text>
              </FormLabel>
              <Input
                variant="primary"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">Badge Value</Text>
              </FormLabel>
              <Input
                variant="primary"
                value={badgeValue}
                onChange={(e) => setBadgeValue(e.target.value)}
              />
            </FormControl>

            <Flex
              w="100%"
              h="1px"
              bg="neutral.300"
              mt="10px"
            />

            <Grid w="100%" templateColumns='repeat(4, 1fr)' gap="5px" mt="10px">
              { ROOM_NUMBERS.map((num: number) => (
                <Button
                  key={num}
                  onClick={() => toggleRoomSelection(num)}
                  isActive={selectedRooms.includes(num)}
                  borderRadius="8px"
                  border="1px"
                  borderColor="#0C727E"
                  bg="#FFFFFF"
                  color="#0C727E"
                  cursor="pointer"
                  height="fit-content"
                  paddingY="8px"
                  _hover={{
                    color: "#FFFFFF",
                    bg: "#0C727E",
                  }}
                  _active={{
                    color: "#FFFFFF",
                    bg: "#0C727E",
                  }}
                  _disabled={{
                    opacity: 0.5,
                    border: "0px",
                    color: "#FFFFFF",
                    bg: "#0C727E",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                  }}
                >
                  <Text textStyle="web.s1" color="inherit">Room {num}</Text>
                </Button>
              ))}
            </Grid>

            <Flex alignItems="center" justifyContent="flex-end" gap="5px" mt="15px">
              <Button variant="white" onClick={onClose}>
                <Text textStyle="web.s1">Cancel</Text>
              </Button>
              <Button variant="primaryFilled" onClick={assignBadge}>
                <Text textStyle="web.s1" color="white">Save</Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


export default CustomBadgeModal