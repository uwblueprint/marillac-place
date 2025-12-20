import { Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import CreateCustomBadgeModal from "./components/CreateCustomBadgeModal";
import CustomBadgeTable from "./components/CustomBadgeTable";
import SystemBadgeTable from "./components/SystemBadgeTable";
import { GET_CUSTOM_BADGES } from "../../../gql/customBadgeRequests";
import { GET_SYSTEM_BADGES } from "../../../gql/systemBadgeRequests";
import AssignCustomBadgeModal from "./components/AssignCustomBadgeModal";
import GreenOutlineButton from "../../../ui/buttons/GreenOutlineButton";
import OrangeButton from "../../../ui/buttons/OrangeButton";

export default function AdminBadgesPage() {
  const [create, setCreate] = useState(false);
  const [assign, setAssign] = useState(false);

  const {
    loading: customBadgesLoading,
    error: customBadgesError,
    data: customBadgesData,
    refetch: refetchCustomBadges,
  } = useQuery(GET_CUSTOM_BADGES);

  const {
    loading: systemBadgesLoading,
    error: systemBadgesError,
    data: systemBadgesData,
    refetch: refetchSystemBadges,
  } = useQuery(GET_SYSTEM_BADGES);

  return (
    <Flex width="100%" height="fit-content" flexDir="column" gap="15px">
      <Flex
        width="100%"
        height="fit-content"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="15px">
          <Text textStyle="web.h2" color="primary.700">
            System Badges
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
            System badges will be granted to participants automatically.
          </Text>
        </Flex>
      </Flex>
      <SystemBadgeTable
        loading={systemBadgesLoading}
        error={systemBadgesError?.message ?? ""}
        badges={systemBadgesData?.getSystemBadges ?? []}
        refetch={refetchSystemBadges}
      />
      <Flex
        width="100%"
        height="fit-content"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" gap="15px">
          <Text textStyle="web.h2" color="primary.700">
            Custom Badges
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
            You can create new and reward participants custom badges.
          </Text>
        </Flex>
        <Flex alignItems="center" gap="15px">
          <GreenOutlineButton
            label="Assign Custom Badge"
            action={() => setAssign(true)}
            is_active={assign}
          />
          <OrangeButton
            label="Create New"
            action={() => setCreate(true)}
            is_active={create}
          />
        </Flex>
      </Flex>
      <CustomBadgeTable
        loading={customBadgesLoading}
        error={customBadgesError?.message ?? ""}
        badges={customBadgesData?.getCustomBadges ?? []}
        refetch={refetchCustomBadges}
      />

      {create && (
        <CreateCustomBadgeModal
          onClose={() => setCreate(false)}
          refetch={refetchCustomBadges}
        />
      )}
      {assign && <AssignCustomBadgeModal onClose={() => setAssign(false)} customBadges={customBadgesData?.getCustomBadges ?? []} />}
    </Flex>
  );
}
