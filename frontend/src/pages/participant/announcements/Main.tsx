import React, { useState } from "react";
import { Button, Flex, Grid, Text, Stack } from "@chakra-ui/react";
import ParticipantPageHeader from "../../../components/participant/PageHeader";
import ParticipantAnnouncementCard from "./elements/ParticipantAnnouncementCard";
import ParticipantAnnouncementFocused from "./elements/ParticipantAnnouncementFocused";
import Announcement, { announcementData } from "./elements/Announcement";

export default function ParticipantsAnnouncementsPage() {
  const [filter, setFilter] = useState(0);
  const [focusedId, setFocusedId] = useState(null as string | null);
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(announcementData);
  const focusedAnnouncement = focusedId
    ? announcements.find((a) => a.id === focusedId)
    : null;

  const applyPatch = (
    id: string,
    patch: Partial<
      Pick<
        Announcement,
        "allRooms" | "message" | "importance" | "hasRead" | "isPinned" | "time"
      >
    >
  ) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === id
          ? new Announcement(
              a.id,
              patch.allRooms ?? a.allRooms,
              patch.message ?? a.message,
              patch.importance ?? a.importance,
              patch.hasRead ?? a.hasRead,
              patch.isPinned ?? a.isPinned,
              patch.time ?? a.time
            )
          : a
      )
    );
  };

  return (
    <>
      <ParticipantPageHeader currentPage="Announcements" />
      {!focusedId && (
        <Flex w="100%" padding="20px" flexDir="column" gap="15px">
          <Flex w="100%" alignItems="center" justifyContent="center" gap="5px">
            <Button
              variant="secondaryOutlineMobile"
              isActive={filter === 0}
              onClick={() => setFilter(0)}
            >
              All
            </Button>
            <Button
              variant="secondaryOutlineMobile"
              isActive={filter === 1}
              onClick={() => setFilter(1)}
            >
              Unread
            </Button>
            <Button
              variant="secondaryOutlineMobile"
              isActive={filter === 2}
              onClick={() => setFilter(2)}
            >
              Pinned
            </Button>
            <Button
              variant="secondaryOutlineMobile"
              isActive={filter === 3}
              onClick={() => setFilter(3)}
            >
              Important
            </Button>
          </Flex>
          <Text textStyle="mobile.h2" color="text.light.secondary">
            Most Recent
          </Text>
          {announcements.map((announcement: Announcement, idx: number) => {
            return (
              <Stack key={idx} spacing={0}>
                <ParticipantAnnouncementCard
                  announcement={announcement}
                  setFocusedId={setFocusedId}
                />
              </Stack>
            );
          })}
        </Flex>
      )}
      {focusedAnnouncement && (
        <ParticipantAnnouncementFocused
          announcement={focusedAnnouncement}
          setFocusedId={setFocusedId}
          setMarkedAsRead={(markedRead: boolean) =>
            applyPatch(focusedAnnouncement.id, { hasRead: markedRead })
          }
          setPinned={(pinned: boolean) =>
            applyPatch(focusedAnnouncement.id, { isPinned: pinned })
          }
        />
      )}
    </>
  );
}
