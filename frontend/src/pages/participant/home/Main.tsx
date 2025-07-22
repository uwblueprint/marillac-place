import React from "react";
import ParticipantPageHeader from "../../../components/participant/PageHeader";
import HomeContent from "../../../components/participant/HomeContent";

export default function ParticipantsHomePage() {
  return (
    <>
      <ParticipantPageHeader currentPage="Home" />
      <HomeContent />
    </>
  );
}
