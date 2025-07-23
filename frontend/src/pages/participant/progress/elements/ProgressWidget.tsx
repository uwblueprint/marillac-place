import { useContext } from "react";
import ProgressBar from "../../../../components/participant/ProgressBar";
import { ParticipantContext } from "../../../../components/participant/ParticipantContext";
import { GET_PARTICIPANT_BY_ID } from "../../../../gql/queries";
import { useQuery } from "@apollo/client";

export default function ProgressWidget() {
  const participant = useContext(ParticipantContext);

  const {
    data: participantData,
    loading: participantLoading,
    error: participantError,
  } = useQuery(GET_PARTICIPANT_BY_ID, {
    variables: { id: participant?.id },
  });

  if (participantLoading) return <></>;
  if (participantError) return <></>;

  return (
    <ProgressBar
      startValue={0}
      currentValue={participantData.marillac_bucks}
      endValue={participantData.marillac_bucks_goal}
    />
  );
}
