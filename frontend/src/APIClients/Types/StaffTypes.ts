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

export type UserRequestID = {
    userId: string;
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
  
  export type UserRequestAdd = {
    userId?: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    displayName: string;
    profilePictureURL?: string;
    isActive: boolean;
    isAdmin: boolean;
};

export type UserRequestUpdate = {
      userId: number;
      email?: string;
      phoneNumber?: string;
      firstName?: string;
      lastName?: string;
      displayName?: string;
      profilePictureURL?: string;
      isActive?: boolean;
      isAdmin?: boolean;
  };

  export type UserRequestDelete = {
    userId: number;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    profilePictureURL?: string;
    isActive?: boolean;
    isAdmin?: boolean;
};