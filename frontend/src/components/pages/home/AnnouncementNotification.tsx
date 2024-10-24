import React, { useState } from "react";
import moment from "moment";
import { Box, Text, Flex, Icon, IconButton } from "@chakra-ui/react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { Announcement } from "../../../types/NotificationTypes";

const AnnouncementNotification = ({
  room,
  message,
  createdAt,
}: Announcement): React.ReactElement => {
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <Box w="100%" p={3}>
      <Flex justifyContent="space-between" maxW="100%" position="relative">
        <Flex alignItems="flex-start" w="100%" overflow="hidden">
          <Box
            borderRadius="full"
            border="2px solid"
            borderColor="#C5C8D8"
            p={1}
            mr={3}
          >
            <Icon
              as={PersonOutlineOutlinedIcon}
              boxSize={10}
              color="purple.main"
            />
          </Box>
          <Flex flexDir="column" maxW="80%">
            <Flex alignItems="baseline" w="100%">
              <Text as="b" mr={4}>
                {"Admin to Room ".concat(room)}
              </Text>
              <Text color="gray.500" fontSize="sm" margin="0">
                posted at {moment(createdAt).format("h:mm a")}
              </Text>
            </Flex>
            <Box w="100%">
              {showFullMessage ? (
                <Text mt={1} mb={1}>
                  {message}
                </Text>
              ) : (
                <Text
                  mt={1}
                  mb={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {message}
                </Text>
              )}
            </Box>
          </Flex>
        </Flex>
        <Flex ml="auto">
          <IconButton
            aria-label="expand"
            bg="white"
            _hover={{ bg: "white" }}
            onClick={() => setShowFullMessage(!showFullMessage)}
            icon={showFullMessage ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            size="md"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default AnnouncementNotification;
