export type UserType = "STAFF" | "RESIDENT";

export interface User {
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: boolean;
}

export interface Resident extends User {
  userId: number;
  residentId: number;
  birthDate: Date;
  roomNumber: number;
  credits: number;
  dateJoined: Date;
  dateLeft: Date | null;
  notes: string | null;
}

export interface Staff extends User {
  isAdmin: boolean;
}
