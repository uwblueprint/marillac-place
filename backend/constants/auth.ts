import { SignOptions } from "jsonwebtoken";

export const DEFAULT_JWT_EXPIRES_IN: NonNullable<SignOptions["expiresIn"]> =
  "7d";

export function getJwtExpiresIn(): NonNullable<SignOptions["expiresIn"]> {
  return (process.env.JWT_EXPIRES_IN || DEFAULT_JWT_EXPIRES_IN) as NonNullable<
    SignOptions["expiresIn"]
  >;
}
