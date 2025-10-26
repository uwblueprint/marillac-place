import React, { createContext } from "react";

type ParticipantContextType = {
  id: number;
};

export const ParticipantContext = createContext<
  ParticipantContextType | undefined
>(undefined);
