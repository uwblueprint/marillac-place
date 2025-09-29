import React, {useState} from "react";
import { useMutation, gql } from '@apollo/client';
import { useToast, Box, Text, IconButton, Flex } from "@chakra-ui/react";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DELETE_ANNOUNCEMENT } from '../../../../gql/mutations';
import EditAnnouncementModal from "./EditAnnouncementModal";

const useDeleteAnnouncement = () => {
  const [deleteAnnouncementMutation] = useMutation(DELETE_ANNOUNCEMENT);

  const handleDeleteAnnouncement = async (announcement_id: number) => {
    if (typeof announcement_id !== 'number' || Number.isNaN(announcement_id)) {
      console.log("Unable to delete announcement, invalid announcement id.");
      return;
    }

    try {
      const { data } = await deleteAnnouncementMutation({
        variables: { announcement_id },
      });

      if (data?.deleteAnnouncement) {
        localStorage.setItem("notification", "Announcement deleted");
        window.location.reload();
      } else {
        throw new Error('Announcement deletion failed.');
      }
    } catch (error: any) {
      console.error('ERROR: Error in deleting announcement. ', error);
    }
  };

  return { handleDeleteAnnouncement };
};

type AnnouncementCardProps = {
  announcement_id: any;
  room: string;
  message: string;
  timestamp: string;
  importance?: 0 | 1 | 2;
};

export default function AnnouncementCard({
  announcement_id,
  room,
  message,
  timestamp,
  importance = 0,
}: AnnouncementCardProps) {
  const { handleDeleteAnnouncement } = useDeleteAnnouncement();
  const [edit, setEdit] = useState(false);
  
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
            {Array.from({ length: importance }).map((_, i) => (
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
            icon={<EditIcon sx={{ fontSize: "18px", color: "#808080" }} />}
            size="sm"
            variant="ghost"
            onClick={() => setEdit(true)}
          />
          <IconButton
            aria-label="Delete"
            icon={<DeleteOutlineIcon sx={{ fontSize: "18px", color: "#d34c5c" }} />}
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteAnnouncement(announcement_id)}
          />
        </Flex>
      </Flex>
      { edit &&
        <EditAnnouncementModal
          isOpen={edit}
          setIsOpen={() => setEdit(false)}
          announcementId={announcement_id}
          sendTo={room}
          initialMessage={message}
          initialPriority={importance === 2 ? "CRITICAL" : importance === 1 ? "HIGH" : "NORMAL"}
        />
      }
    </Box>
  );
}
