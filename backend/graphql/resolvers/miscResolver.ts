import MiscService from "../../services/implementation/miscImplementation";
import IMiscService from "../../services/interface/miscInterface";

const miscService: IMiscService = new MiscService();
const miscResolvers = {
  Query: {
    getAvailableRooms: async (): Promise<number[]> => {
      return miscService.getAvailableRooms();
    },
  },
};

export default miscResolvers;
