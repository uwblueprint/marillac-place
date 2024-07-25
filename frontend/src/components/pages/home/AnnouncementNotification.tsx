import React, {useState} from "react";
import moment from "moment";
import { Box, Text, Flex, Icon, IconButton } from "@chakra-ui/react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import {Announcement} from '../../../types/NotificationTypes';
import { truncateMessage } from "../../../utils/StringUtils";

const AnnouncementNotification = ({ room, author, message, createdAt }: Announcement): React.ReactElement => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  
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
              {"Admin to Room ".concat(room)}
            </Text>
            <Text color="gray.500" fontSize="sm">
              posted at {moment(createdAt).format("h:mm a")}
            </Text>
          </Flex>
          <Text
            mt={1}>
          {showFullMessage ? message : truncateMessage(message, 60)}
          </Text>
          <IconButton
            aria-label="expand"
            colorScheme="black"
            onClick={() => setShowFullMessage(!showFullMessage)}
            icon={showFullMessage ? <MdExpandLess /> : <MdExpandMore />}
          />
        </Flex>
      </Flex>
    </Box>
    );
  };
  
export default AnnouncementNotification;
