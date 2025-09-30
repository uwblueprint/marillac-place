import ParticipantPageHeader from "../../../common/participant/PageHeader";
import WeeklyEarningsChart from "./elements/EarningsWidget";

const mockEarnings = [50, 75, 40, 60, 80, 90, 100];

export default function ParticipantsProgressPage() {
  return (
    <>
      <ParticipantPageHeader currentPage="Progress" />
      <WeeklyEarningsChart weeklyEarnings={mockEarnings} />
    </>
  );
}
