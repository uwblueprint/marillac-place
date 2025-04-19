import React, { useState } from 'react'; // Imports
import {
  Flex,
  Button,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";
import SideBar from '../../common/SideBar';

const AnnouncementsPage = (): React.ReactElement => {
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(new Array(10).fill(false)); // Keeping track of buttons on and off

  const handleButtonClick = (id: number) => { // Handing button clicks
    setSelectedButtons((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[id] = !newSelected[id];
      return newSelected;
    });
  };

  const handleSelectAll = () => { // Select all, makes the array all true
    setSelectedButtons(new Array(10).fill(true));
  };

  const handleDeselectAll = () => { // Deselect all, makes the array all false
    setSelectedButtons(new Array(10).fill(false));
  };

  return (
    <Flex>
      <SideBar /> {/* Using sidebar */}

      <Flex flexDir="column" flex="1" position="relative"> { /* Box for design at the top */}
        <Box  // Box for header
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="60px"
          bg="#e6eeee"
          zIndex={-1}
        />

        <Flex direction="column" ml={10} mt={20}>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <Heading size="lg" mr={3} color="#2c7a7b"> { /* Announcements text, expires in 48h text, and the announcements button created in a row */}
                Announcements
              </Heading>
              <Flex mt={3}>
                <Text fontSize="sm" color="gray.500">
                  Expires in 48h
                </Text>
              </Flex>
              <Flex ml={650} mt={5}>
              <Button
                colorScheme="orange"
                size="sm"
              >
                + Create Announcement
              </Button>
              </Flex>
            </Flex>
          </Flex>
          
          <Flex wrap="wrap" alignItems="center" gap="10px">
            <Text color="#2c7a7b" fontWeight="semibold" mr={2} mt={3}> { /* Filters text */}
              Filters:
            </Text> { /* Selectall button handing below */}
            {selectedButtons.map((isSelected, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(index)}
                variant={isSelected ? "solid" : "outline"}
                size="sm"
                borderColor="teal.500"
                color={isSelected ? "white" : "teal.600"}
                bg={isSelected ? "teal.500" : "transparent"}
                _hover={{ bg: isSelected ? "teal.600" : "teal.50" }}
              >
                Room {index + 1}
              </Button>
            ))} { /* Select all button */}
            <Button
              variant="link"
              textDecoration="underline"
              color="gray.600"
              onClick={handleSelectAll}
              size="sm"
              ml={2}
            >
              Select All
            </Button>
            { /* Deselect all button */}
            <Button
              variant="link"
              textDecoration="underline"
              color="gray.600"
              onClick={handleDeselectAll}
              size="sm"
            >
              Deselect All
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage; // Exports page
