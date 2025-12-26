import { Divider, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";
import { ExclamationMark, Dot } from "../../../../ui/icons/NotificationIcons";
import { Pin } from "../../../../ui/icons/ActionIcons";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import { UPDATE_RECEIVED_ANNOUNCEMENT } from "../../../../gql/receivedAnnouncementRequests";
import { ParticipantContext } from "../../../ParticipantContext";

type AnnouncementInfo = {
  uaid: number;
  allRooms: boolean;
  message: string;
  importance: number;
  read: boolean;
  pinned: boolean;
  date: string;
};

type AnnouncementsExpandedViewProps = {
  announcement: AnnouncementInfo;
  onBack: () => void;
};

export default function AnnouncementsExpandedView({
  announcement,
  onBack,
}: AnnouncementsExpandedViewProps) {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.pid;

  const [pinned, setPinned] = useState<boolean>(announcement.pinned);
  const prevPinnedRef = useRef<boolean>(announcement.pinned);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [updatePinRead] = useMutation(UPDATE_RECEIVED_ANNOUNCEMENT);

  useEffect(() => {
    let cancelled = false;
  
    const shouldSkip = !participantId || pinned === prevPinnedRef.current;
  
    if (!shouldSkip) {
      const updatePin = async () => {
        setUpdating(true);
        try {
          await updatePinRead({
            variables: {
              aid: announcement.uaid,
              pid: participantId,
              pinned,
            },
          });
  
          if (!cancelled) {
            prevPinnedRef.current = pinned;
          }
        } catch (err) {
          if (!cancelled) {
            setPinned(prevPinnedRef.current);
            setError("Unable to update pin status");
          }
        } finally {
          if (!cancelled) setUpdating(false);
        }
      };
  
      updatePin();
    }
  
    return () => {
      cancelled = true;
    };
  }, [announcement.uaid, participantId, pinned, updatePinRead]);
  
  useEffect(() => {
    let cancelled = false;
  
    const shouldSkip = !participantId || announcement.read;
  
    if (!shouldSkip) {
      const markAsRead = async () => {
        setUpdating(true);
        try {
          await updatePinRead({
            variables: {
              aid: announcement.uaid,
              pid: participantId,
              read: true,
            },
          });
        } catch (err) {
          if (!cancelled) setError("Unable to mark as read");
        } finally {
          if (!cancelled) setUpdating(false);
        }
      };
  
      markAsRead();
    }
  
    return () => {
      cancelled = true;
    };
  }, [announcement.uaid, announcement.read, participantId, updatePinRead]);
  
  // mark as unread (manual function)
  const handleMarkAsUnread = async () => {
    if (!participantId || updating) return;
    setError(""); 
    setUpdating(true);

    try {
      await updatePinRead({
        variables: {
          aid: announcement.uaid,
          pid: participantId,
          read: false,
        },
      });
      onBack(); 
    } catch (err) {
      setError("Unable to mark as unread");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Flex alignItems="center" justify="space-between">
        <Text textStyle="mobile.h2">
          {announcement.allRooms ? "Admin To All Rooms" : "Admin To Your Room"}
        </Text>
        <Text
          onClick={onBack} // Use callback instead of reload
          textStyle="mobile.b1"
          textDecoration="underline"
          cursor="pointer"
          _hover={{
            textDecoration: "none",
          }}
        >
          Back to Announcements
        </Text>
      </Flex>

      <Flex alignItems="center" justify="space-between">
        <Flex gap="12px">
          {announcement.importance !== 0 && (
            <Flex gap="8px" alignItems="center">
              <ExclamationMark size={4} />
              <Text textStyle="mobile.b1" color="danger.800">
                Priority
              </Text>
            </Flex>
          )}

          {pinned && (
            <Flex gap="8px" alignItems="center">
              <Pin size={8} color="secondary.700" />
              <Text textStyle="mobile.b1" color="secondary.700">
                Pinned
              </Text>
            </Flex>
          )}
        </Flex>
        <Text textStyle="mobile.b1" color="text.light.secondary">
          {formatDateTimeString(announcement.date)}
        </Text>
      </Flex>

      <Divider borderColor="neutral.300" />

      <Text textStyle="mobile.b1">{announcement.message}</Text>

      {error && (
        <Text textStyle="mobile.b2" color="danger.800" mt="8px">
          {error}
        </Text>
      )}

      <Flex marginTop="8px" gap="12px" alignItems="center">
        <Flex alignItems="center" gap="8px">
          <GreenOutlineButton
            label="Mark as Unread"
            action={handleMarkAsUnread}
            is_active={false}
          />
          <Dot size={14} />
        </Flex>
        <Flex alignItems="center" gap="8px">
          <GreenOutlineButton
            label={pinned ? "Unpin" : "Pin"}
            action={() => setPinned(!pinned)}
            is_active={false}
          />
          <Pin size={8} color={pinned ? "secondary.700" : "primary.700"} />
        </Flex>
      </Flex>
    </>
  );
}