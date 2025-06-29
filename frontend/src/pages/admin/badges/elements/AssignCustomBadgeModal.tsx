import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  Flex,
  FormControl,
  FormLabel,
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  extendTheme,
  ChakraProvider,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import {
  GET_PARTICIPANTS_BY_ROOMS,
  GET_CUSTOM_BADGES,
} from "../../../../gql/queries";
import { ASSIGN_CUSTOM_BADGE } from "../../../../gql/mutations";

interface AssignCustomBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignCustomBadgeModal: React.FC<AssignCustomBadgeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [badgeName, setBadgeName] = useState("");
  const [badgeValue, setBadgeValue] = useState<string>("");
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [badges, setBadges] = useState<{ badge_id: number; name: string }[]>(
    []
  );
  const { data: badgeData } = useQuery(GET_CUSTOM_BADGES);

  useEffect(() => {
    if (badgeData?.getCustomBadges) {
      setBadges(badgeData.getCustomBadges);
    }
  }, [badgeData]);

  const [getParticipantsByRooms] = useLazyQuery(GET_PARTICIPANTS_BY_ROOMS);
  const [assignCustomBadge] = useMutation(ASSIGN_CUSTOM_BADGE, {
    onCompleted: () => {
      localStorage.setItem(
        "notification",
        `Assigned Custom Badge: ${badgeName}`
      );
      window.location.reload();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const toggleRoomSelection = (room: number) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const assignBadge = async () => {
    setError("");
    if (!badgeName.trim() || !badgeValue.trim() || selectedRooms.length === 0) {
      setError("Missing fields");
      return;
    }
    try {
      const res = await getParticipantsByRooms({
        variables: { room_numbers: selectedRooms },
      });
      const participants = res?.data?.getParticipantsByRooms;
      if (!participants || participants.length !== selectedRooms.length) {
        setError("No participants found for some selected rooms");
        return;
      }
      const participantIds = participants.map((p: any) => p.participant_id);
      const selectedBadge = badges.find((badge) => badge.name === badgeName);
      const badgeId = selectedBadge?.badge_id;
      await assignCustomBadge({
        variables: {
          badge_id: badgeId,
          participant_ids: participantIds,
        },
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        boxShadow="xl"
        borderRadius="16px"
        width="450px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">
            Assign Custom Badge
          </Text>
          <Flex flexDir="column" gap="10px">
            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Badge Name
                </Text>
              </FormLabel>
              <Select
                textStyle="web.b3"
                fontSize="14px"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                placeholder="Select a Badge"
              >
                {badgeData?.getCustomBadges?.map((badge: any) => (
                  <option key={badge.name} value={badge.name}>
                    {badge.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Badge Value
                </Text>
              </FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="text.light.secondary"
                >
                  $
                </InputLeftElement>
                <Input
                  type="number"
                  variant="primary"
                  value={badgeValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setBadgeValue("");
                    } else {
                      const num = parseFloat(val);
                      if (!Number.isNaN(num)) {
                        setBadgeValue(val);
                      }
                    }
                  }}
                  placeholder="0.00"
                  min={0}
                  step={0.01}
                  pl="7"
                />
              </InputGroup>
            </FormControl>

            <Flex w="100%" h="1px" bg="neutral.300" mt="10px" />

            <Text textStyle="web.s1" color="text.light.secondary">
              Choose Room(s)
            </Text>
            <Grid w="100%" templateColumns="repeat(4, 1fr)" gap="5px" mt="10px">
              {ROOM_NUMBERS.map((num: number) => (
                <Button
                  key={num}
                  onClick={() => toggleRoomSelection(num)}
                  isActive={selectedRooms.includes(num)}
                  borderRadius="8px"
                  border="1px"
                  borderColor="#0C727E"
                  bg="#FFFFFF"
                  color="#0C727E"
                  cursor="pointer"
                  height="fit-content"
                  paddingY="8px"
                  _hover={{
                    color: "#FFFFFF",
                    bg: "#0C727E",
                  }}
                  _active={{
                    color: "#FFFFFF",
                    bg: "#0C727E",
                  }}
                  _disabled={{
                    opacity: 0.5,
                    border: "0px",
                    color: "#FFFFFF",
                    bg: "#0C727E",
                    cursor: "not-allowed",
                    pointerEvents: "none",
                  }}
                >
                  <Text textStyle="web.s1" color="inherit">
                    Room {num}
                  </Text>
                </Button>
              ))}
            </Grid>
            {error && (
              <Text
                textStyle="web.b2"
                fontWeight="600"
                color="#E30000"
                mt="10px"
                mb="-5px"
                textAlign="right"
              >
                {error}
              </Text>
            )}

            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap="5px"
              mt="15px"
            >
              <Button variant="white" onClick={onClose}>
                <Text textStyle="web.s1">Cancel</Text>
              </Button>
              <Button variant="primaryFilled" onClick={assignBadge}>
                <Text textStyle="web.s1" color="white">
                  Save
                </Text>
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignCustomBadgeModal;
