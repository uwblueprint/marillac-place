import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CreateCustomBadgeModal from "./elements/CreateCustomBadgeModal";
import CustomBadgeTable from "./elements/CustomBadgeTable";
import { GET_CUSTOM_BADGES } from "../../../gql/queries";
import AssignCustomBadgeModal from "./elements/AssignCustomBadgeModal";
import EditSystemBadgeModal from "./elements/EditSystemBadgeModal";
import { Badge, BadgeType, BadgeLevel } from "../../../types/BadgeTypes";

export default function AdminBadgesPage() {
  const [create, setCreate] = useState(false);
  const [assign, setAssign] = useState(false);
  const [badges, setBadges] = useState([]);
  
  const [tmp, setTmp] = useState(true);

  const { loading, error, data } = useQuery(GET_CUSTOM_BADGES);

  useEffect(() => {
    if (!loading && !error && data) {
      setBadges(data.getCustomBadges);
    }
  }, [loading, error, data]);
  
  const mockBadgeLevel: BadgeLevel = {
    badgeId: 1,
    level: 0,
    benchmark: 100,
    marillacBucks: 5,
  }
  
  const mockBadge: Badge = {
    badgeId: 1,
    badgeType: BadgeType.SYSTEM,
    name: "test",
    description: "test",
    isActive: true,
    isConsecutive: true,
    badgeLevel: [mockBadgeLevel],
  }

  return (
    <>
      <EditSystemBadgeModal isOpen={tmp} onClose={() => setTmp(false)} selected={mockBadge} />
      <Flex
        w="100%"
        justifyContent="flex-start"
        alignItems="center"
        position="absolute"
        top="17px"
        left="0px"
        zIndex={10}
        paddingX="20px"
        gap="10px"
      />
      <Flex width="100%" flexDir="column" gap="15px">
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
            <Text
              textStyle="web.b3"
              color="text.light.secondary"
              marginTop="7px"
            >
              You can create new and reward participants custom badges.
            </Text>
          </Flex>
          <Flex alignItems="center" gap="15px">
            <Button
              onClick={() => setAssign(true)}
              variant="secondaryOutline"
              fontWeight={700}
              fontSize="12px"
              gap="7px"
            >
              Assign Custom Badge
            </Button>
            <Button
              onClick={() => setCreate(true)}
              variant="primaryFilled"
              fontWeight={700}
              fontSize="12px"
              gap="7px"
            >
              <AddIcon
                style={{
                  width: "15px",
                  height: "15px",
                }}
              />
              Create New
            </Button>
          </Flex>
        </Flex>
        <Flex flexDir="column" w="100%" gap="15px">
          <CustomBadgeTable loading={loading} error={error} badges={badges} />
        </Flex>
      </Flex>
      <CreateCustomBadgeModal isOpen={create} onClose={() => setCreate(false)} />
      <AssignCustomBadgeModal isOpen={assign} onClose={() => setAssign(false)} />
    </>
  );
}
