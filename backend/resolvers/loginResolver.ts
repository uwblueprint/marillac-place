import ILoginService from "../services/interface/loginInterface";
import LoginService from "../services/implementation/loginImplementation";

const loginService: ILoginService = new LoginService();

const loginResolver = {
  Mutation: {
    adminLogin: async (
      _parent: undefined,
      {
        role,
        password,
      }: {
        role: string;
        password: string;
      }
    ) => {
      return loginService.adminLogin(role, password);
    },
    participantLogin: async (
      _parent: undefined,
      {
        id,
        password,
      }: {
        id: number;
        password: string;
      }
    ) => {
      return loginService.participantLogin(id, password);
    },
  },
};

export default loginResolver;
