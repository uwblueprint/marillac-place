
import { NotificationResidentDTO, NotificationDTO } from "./adminService";

export type UserTypes = "STAFF" | "RESIDENT";

export interface UserDTO {
  id: number;
  authId: string;
  type: UserTypes;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: Boolean;
}

export interface CreateUserDTO {
  type: UserTypes;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  displayName: string | null;
  profilePictureURL: string | null;
}

export interface UpdateUserDTO {
  type: UserTypes;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: Boolean;
}

export interface IUserService {

  /**
   * Create a user, email verification configurable
   * @param user the user to be created
   * @param authId the user's firebase auth id, optional
   * @param signUpMethod the method user used to signup
   * @returns a UserDTO with the created user's information
   * @throws Error if user creation fails
   */
  createUser(
    user: CreateUserDTO,
    // authId?: string,
  ): Promise<UserDTO>;

  /**
   * Get user associated with id
   * @param id user's id
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserById(userId: number): Promise<UserDTO>;

  /**
   * Get user associated with email
   * @param email user's email
   * @returns a UserDTO with user's information
   * @throws Error if user retrieval fails
   */
  getUserByEmail(email: string): Promise<UserDTO>;

  /**
   * Get id of user associated with authId
   * @param authId user's authId
   * @returns id of the user
   * @throws Error if user id retrieval fails
   */
  getUserIdByAuthId(authId: string): Promise<number>;

  /**
   * Get authId of user associated with id
   * @param userId user's id
   * @returns user's authId
   * @throws Error if user authId retrieval fails
   */
  getAuthIdById(userId: number): Promise<string>;

  /**
   * Get all user information (possibly paginated in the future)
   * @returns array of UserDTOs
   * @throws Error if user retrieval fails
   */
  getUsers(): Promise<Array<UserDTO>>;

  /**
   * Update a user.
   * Note: the password cannot be updated using this method, use IAuthService.resetPassword instead
   * @param userId user's id
   * @param user the user to be updated
   * @returns a UserDTO with the updated user's information
   * @throws Error if user update fails
   */
  updateUserById(userId: number, user: UpdateUserDTO): Promise<UserDTO>;

  /**
   * Delete a user by id
   * @param userId user's userId
   * @throws Error if user deletion fails
   */
  deleteUserById(userId: number): Promise<void>;

  /**
   * Delete a user by email
   * @param email user's email
   * @throws Error if user deletion fails
   */
  deleteUserByEmail(email: string): Promise<void>;
}

export default IUserService;
