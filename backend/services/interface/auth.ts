export interface IAuthService {
  login(
    role: string,
    encryptedPassword: string,
  ): Promise<{ type: string; accessToken: string }>;
}
