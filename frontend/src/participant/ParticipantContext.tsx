import React, { createContext, ReactNode, useState, useEffect } from "react";
import { getParticipantId } from "../helpers/verifyRole";

type ParticipantContextType = {
  pid: number | null;
  room: number | null;
  setRoom: (room: number) => void;
  balance: number | null;
  setBalance: (balance: number) => void;
};

export const ParticipantContext = createContext<ParticipantContextType>({
  pid: null,
  room: null,
  setRoom: () => {},
  balance: null,
  setBalance: () => {},
});

interface ParticipantProviderProps {
  children: ReactNode;
}

export const ParticipantProvider: React.FC<ParticipantProviderProps> = ({ children }) => {
  const [pid, setPid] = useState<number | null>(null);
  const [room, setRoom] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchPid = async () => {
      const fetchedPid = await getParticipantId();
      setPid(fetchedPid);
    };
    fetchPid();
  }, [pid]);

  return (
    <ParticipantContext.Provider
      value={{
        pid,
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
