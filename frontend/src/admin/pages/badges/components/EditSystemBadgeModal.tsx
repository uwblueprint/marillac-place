import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { UPDATE_SYSTEM_BADGE } from "../../../../gql/systemBadgeRequests";
import { UPDATE_BADGE_LEVEL } from "../../../../gql/badgeLevelRequests";
import PopupContainer from "../../../../ui/containers/PopupContainer";
import TextInput from "../../../../ui/inputs/TextInput";
import { Level } from "../../../../types/enums";
import { BadgeLevel } from "../../../../types/models";
import FixedInput from "../../../../ui/inputs/FixedInput";
import { LEVEL_ORDER } from "../../../../constants/levels";
import { toTitleCase } from "../../../../helpers/stringUtils";
import NumberInput from "../../../../ui/inputs/NumberInput";
import useNotification from "../../../../hooks/useNotification";

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
  const { sendNotification } = useNotification();
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
        badgeLevels[Level.NOVICE].benchmark <=
          badgeLevels[Level.BRONZE].benchmark) &&
      (!(Level.BRONZE in badgeLevels) ||
        !(Level.SILVER in badgeLevels) ||
        badgeLevels[Level.BRONZE].benchmark <=
          badgeLevels[Level.SILVER].benchmark) &&
      (!(Level.SILVER in badgeLevels) ||
        !(Level.GOLD in badgeLevels) ||
        badgeLevels[Level.SILVER].benchmark <=
          badgeLevels[Level.GOLD].benchmark) &&
      (!(Level.GOLD in badgeLevels) ||
        !(Level.DIAMOND in badgeLevels) ||
        badgeLevels[Level.GOLD].benchmark <=
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
      sendNotification("System badge updated successfully");
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
        current_value={toTitleCase(selected.name)}
        orientation="horizontal"
      />

      <TextInput
        label="Badge Criteria"
        current_value={badgeCriteria}
        update_action={setBadgeCriteria}
        size="large"
      />

      <Flex justifyContent="space-between" alignItems="center" w="100%">
        <Flex flexDir="column" gap="5px">
          <Text textStyle="s2">Set Badge Levels</Text>
          {LEVEL_ORDER.map((level: Level) => {
            if (!badgeLevels[level]) return null;
            const data = badgeLevels[level];
            return (
              <Flex
                key={level}
                alignItems="center"
                justifyContent="center"
                width="90%"
              >
                <Text textStyle="b2" width="100px">
                  {toTitleCase(level)}:
                </Text>
                <NumberInput
                  key={level}
                  current_value={data.benchmark}
                  update_action={(value: number) =>
                    setBadgeLevels((prev: any) => {
                      return {
                        ...prev,
                        [level]: { ...prev[level], benchmark: value },
                      };
                    })
                  }
                  size="small"
                />
                <Text textStyle="b2">times</Text>
              </Flex>
            );
          })}
        </Flex>
        <Flex flexDir="column" gap="5px">
          <Text textStyle="s2" textAlign="right">
            Marillac Bucks
          </Text>
          {LEVEL_ORDER.map((level: Level) => {
            if (!badgeLevels[level]) return null;
            const data = badgeLevels[level];
            return (
              <NumberInput
                key={level}
                current_value={data.value}
                update_action={(value: number) =>
                  setBadgeLevels((prev: any) => {
                    return {
                      ...prev,
                      [level]: { ...prev[level], value },
                    };
                  })
                }
                size="small"
              />
            );
          })}
        </Flex>
      </Flex>
    </PopupContainer>
  );
};

export default EditSystemBadgeModal;
