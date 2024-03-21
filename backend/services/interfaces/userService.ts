import { UserType } from "../../prisma";

export type UserDTO = {
  id: number;
  type: UserType;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: boolean;
};

export type SimplifiedUserDTO = Pick<
  UserDTO,
  "id" | "type" | "email" | "firstName" | "lastName"
>;

export interface CreateUserDTO {
  email: string;
  password: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  profilePictureURL?: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profilePictureURL?: string;
  isActive?: boolean;
}

interface IUserService {
  /**
   * Get user associated with email
   * @param email user's email
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserByEmail(email: string): Promise<SimplifiedUserDTO>;

  /**
   * Get id of user associated with authId
   * @param authId user's authId
   * @returns id of the user
   * @throws Error if user id retrieval fails
   */
  getUserIdByAuthId(authId: string): Promise<string>;

  /**
   * Get authId of user associated with id
   * @param userId user's id
   * @returns user's authId
   * @throws Error if user authId retrieval fails
   */
  getAuthIdById(userId: string): Promise<string>;

  /**
   * Get user type associated with authId
   * @param authId user's authId
   * @returns user's type
   * @throws Error if user type retrieval fails
   */
  getUserTypeByAuthId(authId: string): Promise<UserType>;
}

export default IUserService;
