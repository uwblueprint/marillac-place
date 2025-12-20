import React, { useState } from "react";
import { Flex, Input, FormLabel, FormControl, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { UPDATE_SYSTEM_BADGE } from "../../../../gql/systemBadgeRequests";
import { UPDATE_BADGE_LEVEL } from "../../../../gql/badgeLevelRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import { Level } from "../../../../types/enums";
import { BadgeLevel } from "../../../../types/models";
import FixedInput from "../../../../ui/inputs/FixedInput";

interface EditSystemBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: any;
  refetch: () => void;
}

const EditSystemBadgeModal = ({
  isOpen,
  onClose,
  refetch,
  selected,
}: EditSystemBadgeModalProps) => {
  const [badgeCriteria, setBadgeCriteria] = useState(selected.description);
  const [badgeLevels, setBadgeLevels] = useState<
    Record<
      Level,
      {
        benchmark: number;
        value: number;
        originalBenchmark: number;
        originalValue: number;
      }
    >
  >(
    selected.BadgeLevel.reduce(
      (
        obj: Record<
          Level,
          {
            benchmark: number;
            value: number;
            originalBenchmark: number;
            originalValue: number;
          }
        >,
        bl: BadgeLevel
      ) => ({
        ...obj,
        [bl.level]: {
          benchmark: bl.benchmark,
          value: bl.value,
          originalBenchmark: bl.benchmark,
          originalValue: bl.value,
        },
      }),
      {}
    )
  );
  const [error, setError] = useState("");

  const [updateBadgeLevel, { loading: updateBadgeLevelLoading }] =
    useMutation(UPDATE_BADGE_LEVEL);
  const [updateSystemBadge, { loading: updateSystemBadgeLoading }] =
    useMutation(UPDATE_SYSTEM_BADGE);

  const handleSave = async () => {
    setError("");

    const noBadgeLevels = Object.keys(badgeLevels).length === 0;
    const badgeLevelsHaveEmptyFields = Object.values(badgeLevels).some(
      ({ benchmark, value }) => !benchmark || !value
    );
    if (!badgeCriteria || noBadgeLevels || badgeLevelsHaveEmptyFields) {
      setError("Missing fields");
      return;
    }

    const benchmarksAreIncreasing =
      (!(Level.NOVICE in badgeLevels) ||
        !(Level.BRONZE in badgeLevels) ||
        badgeLevels[Level.NOVICE].benchmark <
          badgeLevels[Level.BRONZE].benchmark) &&
      (!(Level.BRONZE in badgeLevels) ||
        !(Level.SILVER in badgeLevels) ||
        badgeLevels[Level.BRONZE].benchmark <
          badgeLevels[Level.SILVER].benchmark) &&
      (!(Level.SILVER in badgeLevels) ||
        !(Level.GOLD in badgeLevels) ||
        badgeLevels[Level.SILVER].benchmark <
          badgeLevels[Level.GOLD].benchmark) &&
      (!(Level.GOLD in badgeLevels) ||
        !(Level.DIAMOND in badgeLevels) ||
        badgeLevels[Level.GOLD].benchmark <
          badgeLevels[Level.DIAMOND].benchmark);
    if (!benchmarksAreIncreasing) {
      setError("Invalid benchmark values (must be increasing)");
      return;
    }

    const requests: Promise<any>[] = [];
    requests.push(
      updateSystemBadge({
        variables: {
          name: selected.name,
          description: badgeCriteria,
        },
      })
    );
    for (const [level, data] of Object.entries(badgeLevels)) {
      if (
        data.originalBenchmark !== data.benchmark ||
        data.originalValue !== data.value
      ) {
        requests.push(
          updateBadgeLevel({
            variables: {
              name: selected.name,
              level: level as Level,
              benchmark: data.benchmark,
              value: data.value,
            },
          })
        );
      }
    }

    try {
      await Promise.all(requests);
      await refetch();
      onClose();
    } catch (err: any) {
      setError("Failed to edit system badge");
    }
  };

  return (
    <PopupContainer
      title="Edit System Badge"
      submit_text="Save Changes"
      submit_action={handleSave}
      cancel_action={onClose}
      error_message={error}
      loading={updateSystemBadgeLoading || updateBadgeLevelLoading}
    >
      <FixedInput
        label="Badge Name"
        current_value={selected.name}
        orientation="horizontal"
      />

      <TextInput
        label="Badge Criteria"
        current_value={badgeCriteria}
        update_action={setBadgeCriteria}
        size="medium"
      />

      {/* revise */}
      <Flex flexDir="column">
        <FormControl>
          <Flex justifyContent="space-between" mb="5px">
            <FormLabel m="0">
              <Text textStyle="web.s1" color="text.light.secondary">
                Set Badge Levels
              </Text>
            </FormLabel>
            <FormLabel m="0">
              <Text
                textStyle="web.s1"
                color="text.light.secondary"
                textAlign="right"
              >
                Set Marillac Bucks
              </Text>
            </FormLabel>
          </Flex>

          {Object.entries(badgeLevels).map(([level, data]) => {
            return (
              <Flex
                key={level}
                justify="space-between"
                alignItems="center"
                w="100%"
                mb="5px"
              >
                <Flex alignItems="center" gap="10px">
                  <Text textStyle="web.b3">{level}:</Text>

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
                        value={data.benchmark}
                        onChange={(e) =>
                          setBadgeLevels((prev: any) => {
                            const newBenchmark = Number(e.target.value);
                            if (Number.isNaN(newBenchmark)) return prev;
                            return {
                              ...prev,
                              [level]: {
                                ...prev[level],
                                benchmark: newBenchmark,
                              },
                            };
                          })
                        }
                        w="75px"
                        min={0}
                      />
                      <Text textStyle="web.b3">days</Text>
                    </>
                  )}
                </Flex>

                <Input
                  variant="primary"
                  textAlign="center"
                  width="75px"
                  value={data.value}
                  onChange={(e) =>
                    setBadgeLevels((prev: any) => {
                      const newValue = Number(e.target.value);
                      if (Number.isNaN(newValue)) return prev;
                      return {
                        ...prev,
                        [level]: { ...prev[level], value: newValue },
                      };
                    })
                  }
                  min={1}
                />
              </Flex>
            );
          })}
        </FormControl>
      </Flex>
    </PopupContainer>
  );
};

export default EditSystemBadgeModal;
