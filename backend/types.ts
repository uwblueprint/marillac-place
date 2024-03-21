// export type UserType = "STAFF" | "RESIDENT";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

// export type UserDTO = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   type: UserType;
// };

// export type CreateUserDTO = Omit<UserDTO, "id"> & { password: string };

// export type UpdateUserDTO = Omit<UserDTO, "id">;

// export type RegisterUserDTO = Omit<CreateUserDTO, "role">;

// export type AuthDTO = Token & UserDTO;

// export type Letters = "A" | "B" | "C" | "D";

export type NodemailerConfig = {
  service: "gmail";
  auth: {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export type SignUpMethod = "PASSWORD" | "GOOGLE";
