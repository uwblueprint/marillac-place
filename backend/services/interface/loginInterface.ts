interface ILoginService {
  adminLogin(role: string, password: string): Promise<{ token: string }>;
  participantLogin(id: number, password: string): Promise<{ token: string }>;
}

export default ILoginService;
