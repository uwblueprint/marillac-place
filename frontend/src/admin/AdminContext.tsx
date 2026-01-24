import React, { createContext, ReactNode, useEffect, useState } from "react";

type AdminContextType = {
  role: string;
  setRole: (role: string) => void;
  roomToParticipant: Record<number, number>;
  setRoomToParticipant: (roomToParticipant: Record<number, number>) => void;
};

export const AdminContext = createContext<AdminContextType>({
  role: "",
  setRole: () => {},
  roomToParticipant: {},
  setRoomToParticipant: () => {},
});

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string>("");
  const [roomToParticipant, setRoomToParticipant] = useState<Record<number, number>>({});

  return (
    <AdminContext.Provider
      value={{
        role,
        setRole,
        roomToParticipant,
        setRoomToParticipant,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
