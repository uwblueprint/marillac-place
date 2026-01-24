import React, { createContext, ReactNode, useState, useEffect } from "react";

type ParticipantContextType = {
  pid: number;
  setPid: (pid: number) => void;
  room: number;
  setRoom: (room: number) => void;
  balance: number;
  setBalance: (balance: number) => void;
  totalEarnings: number;
  setTotalEarnings: (totalEarnings: number) => void;
};

export const ParticipantContext = createContext<ParticipantContextType>({
  pid: -1,
  setPid: () => {},
  room: 0,
  setRoom: () => {},
  balance: 0,
  setBalance: () => {},
  totalEarnings: 0,
  setTotalEarnings: () => {},
});

interface ParticipantProviderProps {
  children: ReactNode;
}

export const ParticipantProvider: React.FC<ParticipantProviderProps> = ({ children }) => {
  const [pid, setPid] = useState<number>(-1);
  const [room, setRoom] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  
  return (
    <ParticipantContext.Provider
      value={{
        pid,
        setPid,
        room,
        setRoom,
        balance,
        setBalance,
        totalEarnings,
        setTotalEarnings,
      }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};
