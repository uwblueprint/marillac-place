import { Divider, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { displayDate2 } from "../../../../utils/formatDateTime";
import Icon from "../../../common/Icon";
import important from "../../../icons/announcements/important.svg";
import orangepin from "../../../icons/announcements/orangepin.svg";
import greenpin from "../../../icons/announcements/greenpin.svg";
import unread from "../../../icons/announcements/unread.svg";
import GreenButton from "../../../common/GreenButton";
import { UPDATE_PIN_READ_ANNOUNCEMENTS } from "../../../../gql/mutations";
import { ParticipantContext } from "../../../common/ParticipantContext";

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
  const participantId = participant?.id;

  const [pinned, setPinned] = useState<boolean>(announcement.pinned);
  const [prevPinned, setPrevPinned] = useState<boolean>(announcement.pinned);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [updatePinRead] = useMutation(UPDATE_PIN_READ_ANNOUNCEMENTS);

  useEffect(() => {
    let active = true;
    const cleanup = () => {
      active = false;
    };

    if (!participantId || pinned === prevPinned) {
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
          setPrevPinned(pinned);
        }
      } catch (err) {
        if (active) setPinned(prevPinned);
      } finally {
        if (active) setUpdating(false);
      }
    })();

    return cleanup;
  }, [pinned]);

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
              <Icon icon={important} width="3px" height="3px" />
              <Text textStyle="mobile.b1" color="#D34C5C">
                Priority
              </Text>
            </Flex>
          )}

          {pinned && (
            <Flex gap="8px">
              <Icon icon={orangepin} width="8px" height="8px" />
              <Text textStyle="mobile.b1" color="#E67D4F">
                Pinned
              </Text>
            </Flex>
          )}
        </Flex>
        <Text textStyle="mobile.b1" color="text.light.secondary">
          {displayDate2(new Date(announcement.date))}
        </Text>
      </Flex>

      <Divider borderColor="neutral.300" />

      <Text textStyle="mobile.b1">{announcement.message}</Text>

      <Flex marginTop="8px" gap="12px">
        <GreenButton
          text="Mark as Unread"
          is_active={false}
          action={() => handleMarkAsUnread()}
          icon={<Icon icon={unread} width="14px" height="14px" />}
        />
        <GreenButton
          text={pinned ? "Unpin" : "Pin"}
          is_active={false}
          action={() => setPinned(!pinned)}
          icon={
            <Icon
              icon={pinned ? orangepin : greenpin}
              width="8px"
              height="8px"
            />
          }
        />
      </Flex>
    </>
  );
}
