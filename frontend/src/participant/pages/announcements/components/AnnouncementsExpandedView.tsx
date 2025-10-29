import { Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { displayDate2 } from "../../../../utils/formatDateTime";
import Icon from "../../../common/Icon";
import important from "../../../icons/announcements/important.svg"
import orangepin from "../../../icons/announcements/orangepin.svg"
import greenpin from "../../../icons/announcements/greenpin.svg"
import unread from "../../../icons/announcements/unread.svg"
import GreenButton from "../../../common/GreenButton";

type AnnouncementInfo = {
    uaid: number;
    allRooms: boolean;
    message: string;
    importance: number;
    read: boolean;
    pinned: boolean;
    date: string;
}

type AnnouncementsExpandedViewProps = {
    announcement: AnnouncementInfo;
}

export default function AnnouncementsExpandedView({ announcement }: AnnouncementsExpandedViewProps) {
    return (
        <>
            <Flex alignItems="center" justify="space-between">
                <Text textStyle="mobile.h2">{announcement.allRooms ? "Admin To All Rooms" : "Admin To Your Room"}</Text>
                <Text textStyle="mobile.b0" color="text.light.secondary">{displayDate2(new Date(announcement.date))}</Text>
            </Flex>

            <Flex gap="12px">
                <Flex gap="8px">
                    <Icon icon={important} width="3px" height="3px" />
                    <Text textStyle="mobile.s1" color="#D34C5C">Priority</Text>
                </Flex>
                <Flex gap="8px">
                    <Icon icon={orangepin} width="8px" height="8px" />
                    <Text textStyle="mobile.s1" color="#E67D4F">Pinned</Text>
                </Flex>
            </Flex>

            <Divider borderColor="neutral.300" />

            <Text>{announcement.message}</Text>

            <Flex marginTop="8px" gap="12px">
                <GreenButton
                    text="Mark as Unread"
                    is_active={false}
                    action={() => {}}
                    icon={<Icon icon={unread} width="14px" height="14px" />}
                />
                <GreenButton 
                    text="Pin"
                    is_active={false}
                    action={() => {}}
                    icon={<Icon icon={greenpin} width="8px" height="8px" />}
                />
            </Flex>
        </>
    )
};