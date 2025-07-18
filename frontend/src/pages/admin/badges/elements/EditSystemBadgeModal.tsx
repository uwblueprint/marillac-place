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
  selected: any;
}

const EditSystemBadgeModal = ({
  isOpen,
  onClose,
  selected,
}: EditSystemBadgeModalProps) => {
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const badgeLevels = ['Novice', 'Bronze', 'Silver', 'Gold', 'Diamond'];

  const originalData: Record<string, { benchmark: number; bucks: number }> = {};
  for (const bl of selected.badge_level) {
    const name = badgeLevels[bl.level];
    originalData[name] = {
      benchmark: bl.benchmark,
      bucks: bl.marillac_bucks,
    };
  }
  const [badgeData, setBadgeData] = useState(originalData);

  const [error, setError] = useState("");

  const [editBadgeLevel] = useMutation(EDIT_BADGE_LEVEL);
  const [editSystemBadge] = useMutation(EDIT_SYSTEM_BADGE);

  const handleSave = async () => {
    console.log("getting to save");
    setError("");

    if (!badgeCriteria) {
      setError("Missing fields");
      return;
    } 

    let prevBenchmark = 0;
    let prevBucks = 0;
    for (const bl of selected.badge_level) {
      const data = badgeData[badgeLevels[bl.level]];
      const { benchmark, bucks } = data;
 
      if (benchmark <= 0 || bucks <= 0) {
        setError("Missing fields");
        return;
      }

      if (benchmark <= prevBenchmark || bucks <= prevBucks) {
        setError("Levels must be increasing");
        return;
      }

      prevBenchmark = benchmark
      prevBucks = bucks
    }

    try {
      await editSystemBadge({
        variables: {
          system_badge_id: selected.badge_id,
          system_badge_name: selected.name,
          system_badge_criteria: badgeCriteria
        }
      });
    } catch (err: any) {
      setError("Failed to edit system badge");
    }

    // list of promises for batch update
    const mutationPromises: Promise<any>[] = [];

    for (const bl of selected.badge_level) {
      const { benchmark: originalBenchmark, bucks: originalBucks } = originalData[badgeLevels[bl.level]]; 
      const { benchmark, bucks } = badgeData[badgeLevels[bl.level]];

      const hasChanged = originalBenchmark !== benchmark || originalBucks !== bucks;
      if (hasChanged){
        mutationPromises.push(
          editBadgeLevel({
            variables:{
              badge_id: selected.badge_id,
              badge_level: bl.level,
              benchmark,
              marillac_bucks: bucks,
            }
          })
        )
      }
    }

    // batched update
    try {
      await Promise.all(mutationPromises);
      localStorage.setItem("notification", "System badge updated");
      window.location.reload();
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
              <Text textStyle="web.b3">
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
                <Flex justifyContent="space-between" mb="5px">
                  <FormLabel m="0">
                    <Text textStyle="web.s1" color="text.light.secondary">
                      Set Badge Levels
                    </Text>
                  </FormLabel>
                  <FormLabel m="0">
                    <Text textStyle="web.s1" color="text.light.secondary" textAlign="right">
                      Set Marillac Bucks
                    </Text>
                  </FormLabel>
                </Flex>

             {Object.entries(badgeData).map(([level, data]) => {
                return (
                  <Flex
                    key={level}
                    justify="space-between"
                    alignItems="center"
                    w="100%"
                    mb="5px"
                  >
                    <Flex alignItems="center" gap="10px">
                      <Text textStyle="web.b3">
                        {level}:
                      </Text>

                      {level === "Novice" ? (
                        <Input
                          value="First Time"
                          variant="primary"
                          width="100px"
                          textAlign="center"
                          isDisabled
                        />
                      ) : (
                        <>
                          <Input
                            variant="primary"
                            textAlign="center"
                            value={badgeData[level].benchmark}
                            onChange={(e) =>
                              setBadgeData((prev: any) => {
                                const newBenchmark = Number(e.target.value)
                                if (Number.isNaN(newBenchmark)) return prev
                                return ({
                                  ...prev,
                                  [level]: {
                                    ...prev[level],
                                    benchmark: newBenchmark,
                                  },
                                })
                              })
                            }
                            w="75px"
                            min={0}
                          />
                          <Text textStyle="web.b3">
                            days
                          </Text>
                        </>
                      )}
                    </Flex>

                    <Input
                      variant="primary"
                      textAlign="center"
                      width="75px"
                      value={badgeData[level].bucks}
                      onChange={(e) =>
                        setBadgeData((prev: any) => {
                          const newBucks = Number(e.target.value)
                          if (Number.isNaN(newBucks)) return prev
                          return ({
                            ...prev,
                            [level]: {
                              ...prev[level],
                              bucks: newBucks,
                            },
                          })
                        })
                      }
                      min={0}
                    />
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
              mt="10px"
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
