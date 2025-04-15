import React, { useState } from 'react';
import {
  Flex,
  Button,
  Heading,
  Text
} from "@chakra-ui/react";
import SideBar from '../../common/SideBar';

const AnnouncementsPage = (): React.ReactElement => {
  const [selectedButtons, setSelectedButtons] = useState<boolean[]>(new Array(10).fill(false));

  const handleButtonClick = (id: number) => {
    setSelectedButtons((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[id] = !newSelected[id];
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedButtons(new Array(10).fill(true));
  };

  const handleDeselectAll = () => {
    setSelectedButtons(new Array(10).fill(false));
  };

  return (
    <Flex>
      <SideBar />
      <Flex flexDir="column" flex={1} ml={20} mr={5} mt={20}>
        {/* Header */}
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Flex alignItems="flex-end">
            <Heading size="lg" mr={3}>Announcements</Heading>
            <Flex mb={1.5} ml={2}>
              <h6 color="lightgray.600">Expires in 48h</h6>
            </Flex>
          </Flex>
          <Flex mt={3} mr={20}>
          <Button colorScheme="orange" size="sm">
            + Create Announcement
          </Button>
          </Flex>
        </Flex>

        {/* Filters */}
        <Flex alignItems="center" wrap="wrap" mb={4} ml={1}>
          <Text mr={4} mb={2} whiteSpace="nowrap" color="black.1000">Filters:</Text>
          <Flex wrap="wrap" alignItems="center">
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
                mr={3}
                mb={2}
              >
                Room {index + 1}
              </Button>
            ))}
            <Button
              variant="link"
              textDecoration="underline"
              color="gray.600"
              onClick={handleSelectAll}
              size="sm"
              mr={3}
              mb={2}
            >
              Select All
            </Button>
            <Button
              variant="link"
              textDecoration="underline"
              color="gray.600"
              onClick={handleDeselectAll}
              size="sm"
              mb={2}
            >
              Deselect All
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage;
