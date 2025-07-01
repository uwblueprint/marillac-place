import React, { useState } from "react";
import {
  Button,
  Flex,
  Input,
  FormLabel,
  FormControl,
  Text,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { EDIT_BADGE_LEVEL, EDIT_SYSTEM_BADGE } from "../../../../gql/mutations";
import { Badge } from "../../../../types/BadgeTypes";

interface EditSystemBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: Badge;
}

type BadgeLevel = "Novice" | "Bronze" | "Silver" | "Gold" | "Diamond";

const EditSystemBadgeModal: React.FC<EditSystemBadgeModalProps> = ({
  isOpen,
  onClose,
  selected,
}) => {
  const [badgeName, setBadgeName] = useState("new badge");
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [badgeData, setBadgeData] = useState({
    Novice: { time: 0, marillacBucks: 0 },
    Bronze: { time: 0, marillacBucks: 0 },
    Silver: { time: 0, marillacBucks: 0 },
    Gold: { time: 0, marillacBucks: 0 },
    Diamond: { time: 0, marillacBucks: 0 },
  });
  const [originalBadgeData, setOriginalBadgeData] = useState(badgeData);

  // to do: implement the usage of actual values on initial render

  const [error, setError] = useState("");

  const [editBadgeLevel] = useMutation(EDIT_BADGE_LEVEL);
  const [editSystemBadge] = useMutation(EDIT_SYSTEM_BADGE);
  const badgeLevelMap: Record<BadgeLevel, number> = {
    Novice: 1,
    Bronze: 2,
    Silver: 3,
    Gold: 4,
    Diamond: 5,
  };

  const handleSave = async () => {
    setError("");
    const badgeId = 1;
    try {
      await editSystemBadge({
        variables: {
          system_badge_id: badgeId,
          system_badge_name: badgeName,
          system_badge_criteria: badgeCriteria
        }
      });
      localStorage.setItem("notification", "System badge updated");
      window.location.reload();
    } catch (err: any) {
      setError("Failed to edit system badge");
    }
  // list of promises for batch update
  const mutationPromises: Promise<any>[] = [];

  for (const level in badgeData) {
    // fix for some linting error
    if (Object.prototype.hasOwnProperty.call(badgeData, level)) {
    const current = badgeData[level as BadgeLevel];
    const original = originalBadgeData[level as BadgeLevel];
    const badgeLevel = level as BadgeLevel;
    const hasChanged = current.time !== original.time || current.marillacBucks !== original.marillacBucks;
    if (hasChanged){
      mutationPromises.push(
        editBadgeLevel({
          variables:{
            badge_id: badgeId,
            badge_level: badgeLevel,
            benchmark: current.time,
            marillac_bucks: current.marillacBucks,
          }
        })
      )
   }
  }}
  try {
    await Promise.all(mutationPromises);
  } catch (err: any) {
    console.error(`Failed to update badge levels`, err);
    setError("one or more badge levels failed to update");
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
        width="500px"
        padding="20px"
      >
        <ModalBody>
          <Text textStyle="web.h3" mb="15px">
            Edit System Badge
          </Text>

          <Flex flexDir="column" gap="10px">
            <Flex gap="5px" alignItems="flex-end">
              <Text textStyle="web.s1" color="text.light.secondary">
                Badge Name
              </Text>
              <Text textStyle="web.b3" color="text.light.secondary">
                {selected.name}
              </Text>
            </Flex>

            <FormControl>
              <FormLabel mb="5px">
                <Text textStyle="web.s1" color="text.light.secondary">
                  Badge Criteria
                </Text>
              </FormLabel>
              <Input
                variant="primary"
                value={badgeCriteria}
                onChange={(e) => setBadgeCriteria(e.target.value)}
              />
            </FormControl>

            <Flex flexDir="column">
              <FormControl>
                <Flex justify="space-between" mb="2">
                  <FormLabel mb="0">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                      Set Badge Levels
                    </Text>
                  </FormLabel>
                  <FormLabel mb="0">
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                      Set Marillac Bucks
                    </Text>
                  </FormLabel>
                </Flex>

             {Object.entries(badgeData).map(([level, data]) => {
                const badgeLevel = level as BadgeLevel;
                return (
                  <Flex
                    key={badgeLevel}
                    justify="space-between"
                    alignItems="center"
                    mb="10px"
                    w="100%" // ensure full width for each row
                  >
                    <Flex alignItems="center" gap="10px">
                      <Text fontSize="sm" minW="70px" color="gray.700">
                        {badgeLevel}:
                      </Text>

                      {badgeLevel === "Novice" ? (
                        <Input
                          value="First Login"
                          isReadOnly
                          variant="filled"
                          w="110px"
                          fontSize="sm"
                        />
                      ) : (
                        <Input
                          variant="primary"
                          value={badgeData[badgeLevel].time}
                          onChange={(e) =>
                            setBadgeData((prev) => ({
                              ...prev,
                              [badgeLevel]: {
                                ...prev[badgeLevel],
                                time: Number(e.target.value),
                              },
                            }))
                          }
                          placeholder="Days"
                          w="60px"
                          fontSize="sm"
                        />
                      )}

                      <Text fontSize="xs" color="gray.500">
                        days
                      </Text>
                    </Flex>

                    {/* Right side: Marillac Bucks input */}
                    <NumberInput
                      value={badgeData[badgeLevel].marillacBucks}
                      onChange={(valueString) =>
                        setBadgeData((prev) => ({
                          ...prev,
                          [badgeLevel]: {
                            ...prev[badgeLevel],
                            marillacBucks: Number(valueString),
                          },
                        }))
                      }
                      min={0}
                      clampValueOnBlur
                      precision={2}
                    >
                      <NumberInputField
                        placeholder="$"
                        fontSize="sm"
                        w="100px"
                      />
                    </NumberInput>
                  </Flex>
                );
              })}

              </FormControl>
            </Flex>
            {error && (
              <Text textStyle="web.b2" fontWeight="600" color="#E30000">
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
              <Button variant="primaryFilled" onClick={handleSave}>
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

export default EditSystemBadgeModal;
