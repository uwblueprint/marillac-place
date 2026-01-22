import React from "react";
import { Flex } from "@chakra-ui/react";
import WeeklyEarningsChart from "./components/WeeklyEarningsChart";
import BucksGoalCard from "./components/BucksGoalCard";
import BadgeDisplay from "./components/BadgeDisplay";

export default function ParticipantsProgressPage() {
  return (
    <Flex direction="column" gap="16px">
      <BucksGoalCard />
      <WeeklyEarningsChart />
      <BadgeDisplay />
    </Flex>
  );
}
