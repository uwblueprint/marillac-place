import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getRole } from "../helpers/verifyRole";

type AdminContextType = {
  role: string | null;
  roomToParticipant: Record<number, number>;
  setRoomToParticipant: (roomToParticipant: Record<number, number>) => void;
};

export const AdminContext = createContext<AdminContextType>({
  role: null,
  roomToParticipant: {},
  setRoomToParticipant: () => {},
});

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [roomToParticipant, setRoomToParticipant] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchRole = async () => {
      const fetchedRole = await getRole();
      setRole(fetchedRole);
    };
    fetchRole();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        role,
        roomToParticipant,
        setRoomToParticipant,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
