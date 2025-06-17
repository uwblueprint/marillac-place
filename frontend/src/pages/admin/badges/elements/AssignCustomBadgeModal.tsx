import React, { useState } from 'react';
import {
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


interface CustomBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const CustomBadgeModal: React.FC<CustomBadgeModalProps> = ({ isOpen, onClose }) => {
  const [badgeName, setBadgeName] = useState('');
  const [badgeValue, setBadgeValue] = useState('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);


  const toggleRoomSelection = (room: string) => {
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


  const cancel = () => {
    setBadgeName('');
    setBadgeValue('');
    setSelectedRooms([]);
    onClose(); // Close the modal on cancel
  };


  if (!isOpen) return null;


  return (
    <Box
      width="448px"
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      fontFamily="body"
    >
      <Heading as="h2" fontSize="20px" fontWeight="semibold" mb={4}>
        Assign Custom Badge
      </Heading>


      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontSize="sm" mb={1} fontWeight="medium">
            Badge Name
          </Text>
          <Input
            placeholder="Enter badge name"
            value={badgeName}
            onChange={(e) => setBadgeName(e.target.value)}
            size="md"
            borderRadius="md"
          />
        </Box>


        <Box>
          <Text fontSize="sm" mb={1} fontWeight="medium">
            Badge Value
          </Text>
          <Input
            placeholder="$0.00"
            value={badgeValue}
            onChange={(e) => setBadgeValue(e.target.value)}
            size="md"
            borderRadius="md"
            color="gray.600"
            bg="white"
          />
        </Box>
      </VStack>


      <Box borderTop="1px solid" borderColor="gray.200" my={5} />


      <Text mb={2} fontSize="sm" fontWeight="medium">
        Choose Room(s)
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={3} mb={8}>
        {Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`).map((room) => (
          <Button
            key={room}
            size="sm"
            borderRadius="lg"
            colorScheme="teal"
            variant={selectedRooms.includes(room) ? 'solid' : 'outline'}
            fontWeight="medium"
            onClick={() => toggleRoomSelection(room)}
          >
            {room}
          </Button>
        ))}
      </Grid>


      <HStack spacing={4} justify="flex-end">
        <Button
          variant="outline"
          colorScheme="gray"
          size="md"
          px={6}
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          colorScheme="orange"
          size="md"
          px={6}
          onClick={assignBadge}
        >
          Assign Badge
        </Button>
      </HStack>
    </Box>
  );
};


export default CustomBadgeModal