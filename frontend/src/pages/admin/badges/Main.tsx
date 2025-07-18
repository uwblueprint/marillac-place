import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Switch,
} from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CreateCustomBadgeModal from "./elements/CreateCustomBadgeModal";
import CustomBadgeTable from "./elements/CustomBadgeTable";
import SystemBadgeTable from "./elements/SystemBadgeTable";
import { GET_CUSTOM_BADGES, GET_SYSTEM_BADGES } from "../../../gql/queries";
import AssignCustomBadgeModal from "./elements/AssignCustomBadgeModal";

export default function AdminBadgesPage() {
  const [create, setCreate] = useState(false);
  const [assign, setAssign] = useState(false);
  
  const [customBadges, setCustomBadges] = useState([]);
  const [systemBadges, setSystemBadges] = useState([]);

  const {
    loading: customBadgesLoading,
    error: customBadgesError,
    data: customBadgesData
  } = useQuery(GET_CUSTOM_BADGES);
  
  const {
    loading: systemBadgesLoading,
    error: systemBadgesError,
    data: systemBadgesData
  } = useQuery(GET_SYSTEM_BADGES);

  useEffect(() => {
    if (!systemBadgesLoading && !systemBadgesError && systemBadgesData) {
      setSystemBadges(systemBadgesData.getSystemBadges);
    }
  }, [systemBadgesLoading, systemBadgesError, systemBadgesData]);
  
  useEffect(() => {
    if (!customBadgesLoading && !customBadgesError && customBadgesData) {
      setCustomBadges(customBadgesData.getCustomBadges);
    }
  }, [customBadgesLoading, customBadgesError, customBadgesData]);

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
          <Text
            textStyle="web.b3"
            color="text.light.secondary"
            marginTop="7px"
          >
            System badges will be granted to participants automatically.
          </Text>
        </Flex>
      </Flex>
      <SystemBadgeTable loading={systemBadgesLoading} error={systemBadgesError} badges={systemBadges} />
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
      <CustomBadgeTable loading={customBadgesLoading} error={customBadgesError} badges={customBadges} />
      
      <CreateCustomBadgeModal isOpen={create} onClose={() => setCreate(false)} />
      <AssignCustomBadgeModal isOpen={assign} onClose={() => setAssign(false)} />
    </Flex>
  );
}
