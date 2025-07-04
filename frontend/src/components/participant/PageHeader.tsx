import { Flex, Text, Image } from '@chakra-ui/react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import TaskBar from './TaskBar';

type PageHeaderProps = {
  marillacBucks: number;
  participantId: number;
  currentPage: string;
}

function ParticipantPageHeader({
  marillacBucks,
  participantId,
  currentPage
}: PageHeaderProps) {
  const [showTaskBar, setShowTaskBar] = useState(false);
  return (
    <Flex
      width="100%"
      height="75px"
      bg="primary.100"
      padding="20px"
      alignItems="flex-end"
      justifyContent="space-between"
      position="relative"
    >
      { !showTaskBar &&
        <Flex onClick={() => setShowTaskBar(true)} cursor="pointer">
          <MenuIcon fontSize="medium" />
        </Flex>
      }
      { showTaskBar &&
        <>
          <Flex onClick={() => setShowTaskBar(false)} cursor="pointer">
            <CloseIcon fontSize="medium" />
          </Flex>
          <TaskBar participantId={participantId} />
        </>
      }
      <Text textStyle="mobile.h1">{currentPage}</Text>
      <Flex gap="7px" alignItems="flex-end" justifyContent="center">
        <Image
          src="/assets/marillac_bucks.png"
          alt="$"
          width="25px"
          height="25px"
          objectFit="cover"
          borderRadius="100%"
        />
        <Text textStyle="mobile.h3">{marillacBucks}</Text>
      </Flex>
    </Flex>
  )
}

export default ParticipantPageHeader;