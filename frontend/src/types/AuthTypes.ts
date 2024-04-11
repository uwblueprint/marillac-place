import { UserType } from "./UserTypes";

export type AuthenticatedUser = {
  id: string;
  type: UserType;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
} | null;

export type DecodedJWT =
  | string
  | null
  | { [key: string]: unknown; exp: number };
