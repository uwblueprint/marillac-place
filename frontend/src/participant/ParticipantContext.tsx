import React, { createContext, ReactNode, useState } from "react";

type ParticipantContextType = {
  pid: number | null;
  setPid: (pid: number) => void;
  room: number | null;
  setRoom: (room: number) => void;
  balance: number | null;
  setBalance: (balance: number) => void;
};

export const ParticipantContext = createContext<ParticipantContextType | null>(
  null
);

interface ParticipantProviderProps {
  children: ReactNode;
}

export const ParticipantProvider: React.FC<ParticipantProviderProps> = ({
  children,
}) => {
  const [pid, setPid] = useState<number | null>(null);
  const [room, setRoom] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  return (
    <ParticipantContext.Provider
      value={{
        pid,
        setPid,
        room,
        setRoom,
        balance,
        setBalance,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};
