import React, { useMemo, useState } from "react";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { DELETE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import useNotification from "../../../../hooks/useNotification";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { Priority } from "../../../../types/enums";

export type AnnouncementDisplay = {
  aid: number;
  roomLabel: string;
  message: string;
  date: string;
  priority: Priority;
};

type AnnouncementCardProps = {
  announcement: AnnouncementDisplay;
  onAnnouncementUpdated: () => Promise<void>;
};

const AnnouncementCard = ({
  announcement,
  onAnnouncementUpdated,
}: AnnouncementCardProps): React.ReactElement => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const { sendNotification } = useNotification();

  const [deleteAnnouncement, { loading: deleteLoading }] = useMutation(DELETE_ANNOUNCEMENT);

  const priorityLevel = useMemo(() => {
    switch (announcement.priority) {
      case Priority.CRITICAL:
        return 2;
      case Priority.HIGH:
        return 1;
      case Priority.NORMAL:
      default:
        return 0;
    }
  }, [announcement.priority]);

  const handleDelete = async () => {
    setActionError("");
    try {
      await deleteAnnouncement({
        variables: { aid: announcement.aid },
      });
      await onAnnouncementUpdated();
      sendNotification("Announcement deleted.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unable to delete announcement.";
      setActionError(errorMessage);
    }
  };

  return (
    <>
      <WidgetContainer paddingX="16px" paddingY="12px" width="100%">
        <Flex direction="row" justifyContent="space-between" alignItems="flex-start" gap="12px">
          <Flex direction="column" gap="6px" flex={1}>
            <Flex alignItems="center" gap="6px">
              <Text textStyle="web.b2" fontWeight={600} color="#000000">
                {announcement.roomLabel}
              </Text>
              {Array.from({ length: priorityLevel }).map((_, index) => (
                <PriorityHighOutlinedIcon
                  key={index}
                  style={{
                    fontSize: "18px",
                    color: "#d34c5c",
                    marginRight: index < priorityLevel - 1 ? "-10px" : 0,
                  }}
                />
              ))}
            </Flex>
            <Text textStyle="web.b2" color="#000000">
              {announcement.message}
            </Text>
            <Text textStyle="web.b3" color="text.light.secondary">
              {formatDateTimeString(announcement.date)}
            </Text>
            {actionError && (
              <Text textStyle="web.b3" color="#E30000">
                {actionError}
              </Text>
            )}
          </Flex>
          <Flex alignItems="center" gap="4px">
            <IconButton
              aria-label="Edit announcement"
              icon={<EditIcon sx={{ fontSize: "18px", color: "#808080" }} />}
              size="sm"
              variant="ghost"
              onClick={() => {
                setActionError("");
                setIsEditOpen(true);
              }}
            />
            <IconButton
              aria-label="Delete announcement"
              icon={<DeleteOutlineIcon sx={{ fontSize: "18px", color: "#d34c5c" }} />}
              size="sm"
              variant="ghost"
              isDisabled={deleteLoading}
              onClick={handleDelete}
            />
          </Flex>
        </Flex>
      </WidgetContainer>

      <EditAnnouncementModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        announcementId={announcement.aid}
        sendToLabel={announcement.roomLabel}
        initialMessage={announcement.message}
        initialPriority={announcement.priority}
        onAnnouncementUpdated={onAnnouncementUpdated}
      />
    </>
  );
};

export default AnnouncementCard;
