interface IMiscService {
  getAvailableRooms(): Promise<number[]>;
}

export default IMiscService;