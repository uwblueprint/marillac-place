import React from "react";
import HomeContent from "./elements/HomeContent";
import ParticipantPageHeader from "../../../common/participant/PageHeader";

export default function ParticipantsHomePage() {
  return (
    <>
      <ParticipantPageHeader currentPage="Home" />
      <HomeContent />
    </>
  );
}
