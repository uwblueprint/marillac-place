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
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { EDIT_BADGE_LEVEL } from "../../../../gql/mutations";
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
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [badgeData, setBadgeData] = useState({
    Novice: { time: 0, marillacBucks: 0 },
    Bronze: { time: 0, marillacBucks: 0 },
    Silver: { time: 0, marillacBucks: 0 },
    Gold: { time: 0, marillacBucks: 0 },
    Diamond: { time: 0, marillacBucks: 0 },
  });
  const [error, setError] = useState("");

  const [editBadgeLevel] = useMutation(EDIT_BADGE_LEVEL);

  const handleSave = async () => {
    setError("");
    // TODO: Add error checking?

    try {
      // await editCustomBadge({
      //   variables: {
      //     custom_badge_id: selected.badge_id,
      //     new_custom_badge_name: badgeName,
      //     new_custom_badge_description: badgeCriteria
      //   }
      // });
      // localStorage.setItem("notification", "Custom badge updated");
      // window.location.reload();
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

            <Flex flexDir="row">
              <Flex flexDir="column">
                <FormControl>
                  <FormLabel mb="5px">
                    <Text textStyle="web.s1" color="text.light.secondary">
                      Set Badge Level
                    </Text>
                  </FormLabel>
                  {Object.entries(badgeData).map(([level, data]) => {
                    const badgeLevel = level as BadgeLevel;

                    return (
                      <Flex flexDir="row" key={badgeLevel}>
                        <Text textStyle="web.s2" color="text.light.secondary">
                          {badgeLevel}:
                        </Text>
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
                        />
                        <Text textStyle="web.s2" color="text.light.secondary">
                          days
                        </Text>
                      </Flex>
                    );
                  })}
                </FormControl>
              </Flex>
              <Flex flexDir="column">
                <FormControl>
                  <FormLabel mb="5px">
                    <Text textStyle="web.s1" color="text.light.secondary">
                      Set Marillac Bucks
                    </Text>
                  </FormLabel>
                  <NumberInput />
                </FormControl>
              </Flex>
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
