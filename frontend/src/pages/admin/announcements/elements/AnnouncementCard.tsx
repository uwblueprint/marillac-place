import React, {useState} from "react";
import {Box, Text, IconButton, Flex} from "@chakra-ui/react";
import React from "react";
import { useMutation, gql } from '@apollo/client';
import { useToast, Box, Text, IconButton, Flex } from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($announcement_id: Int!) {
    deleteAnnouncement(announcement_id: $announcement_id)
  }
`;

const useDeleteAnnouncement = () => {
  const toast = useToast();
  const [deleteAnnouncementMutation] = useMutation(DELETE_ANNOUNCEMENT);

  const handleDeleteAnnouncement = async (announcement_id: number) => {
    console.log("handling delete announcmeent", announcement_id);
    if (typeof announcement_id !== 'number' || Number.isNaN(announcement_id)) {
      toast({
        title: 'Invalid ID',
        description: 'The announcement ID is not valid.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await deleteAnnouncementMutation({
        variables: { announcement_id },
      });

      if (data?.deleteAnnouncement) {
        toast({
          title: 'Deleted',
          description: 'Announcement deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        throw new Error('Announcement deletion failed.');
      }
    } catch (error: any) {
      console.error('ERROR: Error in deleting announcement. ', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return { handleDeleteAnnouncement };
};

type AnnouncementCardProps = {
  key: number;
  room: string;
  message: string;
  timestamp: string;
  importance?: 0 | 1 | 2;
  onEdit?: () => void;
};

export default function AnnouncementCard({
  key,
  room,
  message,
  timestamp,
  importance = 0,
  onEdit,
}: AnnouncementCardProps) {
  const { handleDeleteAnnouncement } = useDeleteAnnouncement();
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg="#FAFAFA"
      borderColor="#c5c8d8"
      boxShadow="sm"
    >
      <Flex direction="row" justify="space-between" align="center" gap="10px">
        <Flex direction="column" flex="1">
          <Flex align="center" gap={1}>
            <Text textStyle="web.c1" fontWeight={700}>
              {room}
            </Text>
            {Array.from({length: importance}).map((_, i) => (
              <PriorityHighOutlinedIcon
                key={i}
                sx={{
                  fontSize: "16px",
                  color: "#d34c5c",
                  mr: i < importance - 1 ? "-12px" : 0,
                }}
              />
            ))}
          </Flex>

          <Text
            textStyle="web.s1"
            fontWeight={600}
            mt={1}
            whiteSpace="pre-line"
            color="#3f3f3f"
          >
            {message}
          </Text>

          <Text textStyle="web.b3" color="text.light.secondary" mt={2}>
            {timestamp}
          </Text>
        </Flex>

        <Flex align="center" gap={1} ml={4}>
          <IconButton
            aria-label="Edit"
            icon={<EditIcon sx={{fontSize: "18px", color: "#808080"}}/>}
            size="sm"
            variant="ghost"
            onClick={onEdit}
          />
          <IconButton
            aria-label="Delete"
            icon={<DeleteOutlineIcon sx={{fontSize: "18px", color: "#d34c5c"}}/>}
            size="sm"
            variant="ghost"
            onClick={() => {
              const confirmed = window.confirm("Are you sure you want to delete this announcement?");
              if (confirmed) {
                handleDeleteAnnouncement(key);
              }
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
