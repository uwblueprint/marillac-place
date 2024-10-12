export type UserRequest = {
    userId?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    displayName?: string;
    profilePictureURL?: string;
    isActive: boolean;
  };
  