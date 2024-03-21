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
   * Create a user, email verification configurable
   * @param user the user to be created
   * @param authId the user's firebase auth id, optional
   * @param signUpMethod the method user used to signup
   * @returns a UserDTO with the created user's information
   * @throws Error if user creation fails
   */
  // createUser(
  //   user: any,
  //   // authId?: string,
  // ): Promise<UserDTO>;

  /**
   * Get user associated with id
   * @param id user's id
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  // getUserById(userId: string): Promise<UserDTO>;

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

  getUserTypeByAuthId(authId: string): Promise<UserType>;
  /**
   * Get all user information (possibly paginated in the future)
   * @returns array of UserDTOs
   * @throws Error if user retrieval fails
   */
  // getUsers(): Promise<Array<UserDTO>>;

  /**
   * Update a user.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param user the user to be updated
   * @returns a UserDTO with the updated user's information
   * @throws Error if user update fails
   */
  // updateUserById(userId: string, user: any): Promise<UserDTO>;

  /**
   * Delete a user by id
   * @param userId user's userId
   * @throws Error if user deletion fails
   */
  // deleteUserById(userId: string): Promise<void>;

  /**
   * Delete a user by email
   * @param email user's email
   * @throws Error if user deletion fails
   */
  // deleteUserByEmail(email: string): Promise<void>;
}

export default IUserService;
