import { Divider, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";
import { Dot, ExclamationMark, Mail} from "../../../../ui/icons/NotificationIcons";
import { Pin } from "../../../../ui/icons/ActionIcons";
import GreenButton from "../../../../ui/buttons/GreenOutlineButton";
import { UPDATE_RECEIVED_ANNOUNCEMENT } from "../../../../gql/receivedAnnouncementRequests";
import { ParticipantContext } from "../../../ParticipantContext";
import { MarillacCoin } from "../../../../ui/icons/MiscIcons";

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
};

export default function AnnouncementsExpandedView({
  announcement,
}: AnnouncementsExpandedViewProps) {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.pid;

  const [pinned, setPinned] = useState<boolean>(announcement.pinned);
  const prevPinnedRef = useRef<boolean>(announcement.pinned);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [updatePinRead] = useMutation(UPDATE_RECEIVED_ANNOUNCEMENT);

  useEffect(() => {
    let active = true;
    const cleanup = () => {
      active = false;
    };

    if (!participantId || pinned === prevPinnedRef.current) {
      return cleanup;
    }

    setUpdating(true);
    (async () => {
      try {
        await updatePinRead({
          variables: {
            announcement_id: announcement.uaid,
            participant_id: participantId,
            pinned,
          },
        });

        if (active) {
          prevPinnedRef.current = pinned;
        }
      } catch (err) {
        if (active) setPinned(prevPinnedRef.current);
      } finally {
        if (active) setUpdating(false);
      }
    })();

    return cleanup;
  }, [announcement.uaid, participantId, pinned, updatePinRead]);

  useEffect(() => {
    let active = true;
    const cleanup = () => {
      active = false;
    };

    if (!participantId || announcement.read) {
      return cleanup;
    }

    setUpdating(true);
    (async () => {
      try {
        await updatePinRead({
          variables: {
            announcement_id: announcement.uaid,
            participant_id: participantId,
            read: true,
          },
        });
      } catch (err) {
        if (active) setError("Unable to mark as read");
      } finally {
        if (active) setUpdating(false);
      }
    })();

    return cleanup;
  }, []);

  const handleMarkAsUnread = async () => {
    if (!participantId || updating) return;
    try {
      setUpdating(true);
      await updatePinRead({
        variables: {
          announcement_id: announcement.uaid,
          participant_id: participantId,
          read: false,
        },
      });
    } catch (err) {
      setError("Unable to mark as unread");
    } finally {
      setUpdating(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Flex alignItems="center" justify="space-between">
        <Text textStyle="mobile.h2">
          {announcement.allRooms ? "Admin To All Rooms" : "Admin To Your Room"}
        </Text>
        <Text
          onClick={() => window.location.reload()}
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
            <Flex gap="8px">
              <ExclamationMark/>
              <Text textStyle="mobile.b1" color="#D34C5C">
                Priority
              </Text>
            </Flex>
          )}

          {pinned && (
            <Flex gap="8px">
              <Pin />
              <Text textStyle="mobile.b1" color="#E67D4F">
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

      <Flex marginTop="8px" gap="12px">
        <GreenButton
          label="Mark as Unread"
          is_active={false}
          action={() => handleMarkAsUnread()}
          icon={<Mail />}
        />
        <GreenButton
          label={pinned ? "Unpin" : "Pin"}
          is_active={false}
          action={() => setPinned(!pinned)}
          icon={pinned ? <Pin/> : <Pin/>} // not pinned is green pin
        />
      </Flex>
    </>
  );
}
