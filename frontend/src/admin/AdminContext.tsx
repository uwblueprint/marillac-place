import React, { createContext, ReactNode, useState } from "react";

type AdminContextType = {
  role: string | null;
  setRole: (role: string) => void;
  roomToParticipant: Record<number, number>;
  setRoomToParticipant: (roomToParticipant: Record<number, number>) => void;
};

export const AdminContext = createContext<AdminContextType | null>(null);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [roomToParticipant, setRoomToParticipant] = useState<
    Record<number, number>
  >({});

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
