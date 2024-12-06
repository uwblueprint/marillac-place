export type UserResponse = {
  userId: number;
  residentId: number;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  profilePictureURL?: string;
  birthDate: string;
  roomNumber: number;
  credits: number;
  dateJoined: string;
  dateLeft?: Date;
  notes?: string;
};

export type UserRequest = {
  email: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  profilePictureURL?: string;
  residentId: number;
  birthDate: string;
  roomNumber: number;
  credits: number;
  dateJoined: string;
  dateLeft?: Date;
  notes?: string;
};

export type UserRequestUpdate = {
  email?: string;
  password?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profilePictureURL?: string;
  residentId?: number;
  birthDate?: string;
  roomNumber?: number;
  credits?: number;
  dateJoined?: string;
  dateLeft?: Date;
  notes?: string;
};

export type ResidentResponse = {
  userId: string;
  residentId: string;
  roomNumber: number;
  credits: number;
  dateJoined: Date;
  dateLeft: Date;
}