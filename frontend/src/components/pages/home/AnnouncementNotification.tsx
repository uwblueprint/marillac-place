import React from "react";
import moment from "moment";
import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import {Announcement} from '../../../types/NotificationTypes';
import { truncateMessage } from "../../../utils/StringUtils";

const AnnouncementNotification = ({ author, message, createdAt }: Announcement): React.ReactElement => {
    return (
      <Box
      w="100%"
      p={3}
    >
      <Flex alignItems="center">
        <Box
          borderRadius="full"
          border="2px solid"
          borderColor="gray.300"
          p={1}
          mr={3}
        >
          <Icon
            as={PersonOutlineOutlinedIcon} boxSize={10}
            color="purple.main" />
          </Box>
          <Flex flexDir="column" w="100%">
          <Flex alignItems="baseline" w="100%">
            <Text as="b" mr={4}>
              {author}
            </Text>
            <Text color="gray.500" fontSize="sm">
              posted at {moment(createdAt).format("h:mm a")}
            </Text>
          </Flex>
          <Text mt={1}>{truncateMessage(message, 120)}</Text>
        </Flex>
      </Flex>
    </Box>
    );
  };
  
export default AnnouncementNotification;
