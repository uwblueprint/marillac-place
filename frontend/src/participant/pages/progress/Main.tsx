import React, { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import { Flex, Spinner } from "@chakra-ui/react";
import ParticipantPageHeader from "../../../common/participant/PageHeader";
import BucksGoalCard from "./elements/BucksGoalCard";
import { ParticipantContext } from "../../../common/participant/ParticipantContext";
import { GET_PARTICIPANT_GOAL } from "../../../gql/queries";

export default function ParticipantsProgressPage() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id ?? "";

  const { loading, error, data } = useQuery(GET_PARTICIPANT_GOAL, {
    variables: { participantId },
    skip: !participant,
  });

  if (error) {
    return <Flex>Something went wrong.</Flex>;
  }

  if (!participant || loading) {
    return <Spinner />;
  }

  return (
    <>
      <ParticipantPageHeader currentPage="Progress" />
      <BucksGoalCard
        value={data.getParticipantById.marillac_bucks ?? 0}
        goal={data.getParticipantById.marillac_bucks_goal}
      />
    </>
  );
}
