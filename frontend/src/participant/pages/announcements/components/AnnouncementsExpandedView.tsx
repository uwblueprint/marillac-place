import { Divider, Flex, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import { ExclamationMark, Dot, Mail } from "../../../../ui/icons/NotificationIcons";
import { Pin, Pinned } from "../../../../ui/icons/ActionIcons";
import GreenOutlineButton from "../../../../ui/buttons/GreenOutlineButton";
import { UPDATE_RECEIVED_ANNOUNCEMENT } from "../../../../gql/receivedAnnouncementRequests";
import { ParticipantContext } from "../../../ParticipantContext";
import { Announcement, ReceivedAnnouncement } from "../../../../types/models";
import ErrorScreen from "../../../../ui/screens/ErrorScreen";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { Priority } from "../../../../types/enums";
import { toTitleCase } from "../../../../helpers/stringUtils";

type AnnouncementsExpandedViewProps = {
  announcement: ReceivedAnnouncement;
  onBack: () => void;
};

export default function AnnouncementsExpandedView({
  announcement,
  onBack,
}: AnnouncementsExpandedViewProps) {
  const { pid } = useContext(ParticipantContext);
  const [error, setError] = useState("");

  const [updatePinRead] = useMutation(UPDATE_RECEIVED_ANNOUNCEMENT);
  const [read, setRead] = useState<boolean>(announcement.read);
  const [pinned, setPinned] = useState<boolean>(announcement.pinned);

  const handleUpdatePin = async (pin: boolean) => {
    if (pid === -1) {
      setError("Unable to update pin status, something went wrong.")
    }

    try {
      await updatePinRead({
        variables: {
          aid: announcement.aid,
          pid,
          pinned: pin,
        },
      });
      setPinned(pin);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleMarkAsUnread = async () => {
    if (pid === -1) {
      setError("Unable to update read status, something went wrong.")
    }

    try {
      if (read) {
        await updatePinRead({
          variables: {
            aid: announcement.aid,
            pid,
            read: false,
          },
        });
        setRead(false);
      }
      onBack(); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoBack = async () => {
    if (pid === -1) {
      setError("Unable to mark message as read, something went wrong.")
    }
 
    try {
      if (!read) {
        await updatePinRead({
          variables: {
            aid: announcement.aid,
            pid,
            read: true,
          },
        });
        setRead(true);
      }
      onBack(); 
    } catch (err: any) {
      setError(err.message);
    }
  }

  const details: Announcement | undefined = announcement.announcement;
  if (!details || (details && (!details.topic || !details.date || !details.message || !details.priority))) {
    return <ErrorScreen message="Unable to load announcement details, something went wrong." />
  }

  return (
    <>
      <Flex alignItems="center" justify="space-between">
        <Text textStyle="h4" color="brand.primaryDark">
          {toTitleCase(details.topic)}
        </Text>
        <UnderlineButton
          label="Go Back"
          action={handleGoBack}
        />
      </Flex>

      <Flex alignItems="center" justify="space-between" marginBottom="4px">
        <Text textStyle="b1" color="text.medium">
          {formatDateV3(new Date(details.date))}
        </Text>

        <Flex gap="12px">
          {details.priority !== Priority.NORMAL && (
            <Flex gap="4px" alignItems="center">
              <ExclamationMark size={12} />
              <Text textStyle="b1" color="indicate.brightRed">
                Priority
              </Text>
            </Flex>
          )}

          {pinned && (
            <Flex gap="4px" alignItems="center">
              <Pinned size={12} />
              <Text textStyle="b1" color="brand.secondaryDark">
                Pinned
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>

      <Divider borderColor="background.border" />

      <Text textStyle="b1" my="8px">{details.message}</Text>

      {error && (
        <Text textStyle="b1" color="danger.800">
          this is an error message
        </Text>
      )}

      <Flex gap="8px" alignItems="center">
        <GreenOutlineButton
          label="Mark as Unread"
          action={handleMarkAsUnread}
          is_active={false}
          icon={<Mail size={14} color="currentColor" />}
        />
        <GreenOutlineButton
          label={pinned ? "Unpin" : "Pin"}
          action={() => handleUpdatePin(!pinned)}
          is_active={false}
          icon={pinned ? <Pinned size={12} color="currentColor" /> : <Pin size={12} color="currentColor" />}
        />
      </Flex>
    </>
  );
}
