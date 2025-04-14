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
      <Flex flexDir="column" flex={1} ml={20} mr={5} mt={10}>
        {/* Heading and Expiry Text */}
        <Flex alignItems="center" mb={4}>
          <Heading size="lg" mr={3}>Announcements</Heading>
          <Text fontSize="sm" color="gray.600">Expires in 48 hr</Text>
        </Flex>

        {/* Filter Buttons Row */}
        <Flex alignItems="center" wrap="wrap" mb={4}>
          <Text mr={4} mb={2} whiteSpace="nowrap">Filter:</Text>
          <Flex wrap="wrap" alignItems="center" flex="1">
            {selectedButtons.map((isSelected, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(index)}
                variant={isSelected ? "solid" : "outline"}
                size="sm"
                mr={2}
                mb={2}
              >
                Room {index + 1}
              </Button>
            ))}
            <Button
              variant="link"
              textDecoration="underline"
              onClick={handleSelectAll}
              mr={4}
              mb={2}
            >
              Select All
            </Button>
            <Button
              variant="link"
              textDecoration="underline"
              onClick={handleDeselectAll}
              mb={2}
            >
              Deselect All
            </Button>
          </Flex>
        </Flex>

        {/* Additional page content can go here */}
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage;
