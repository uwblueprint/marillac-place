import prisma from "../../prisma";
import IMiscService from "../interface/miscInterface";

class MiscService implements IMiscService {
  async getAvailableRooms(): Promise<number[]> {
    try {
      const today = new Date();
      const rooms = await prisma.participant.findMany({
        where: {
          OR: [
            { departure: null },
            { departure: { gte: today.toISOString() } },
          ],
        },
        select: {
          roomNumber: true,
        },
      });
      const occupiedRooms = new Set(rooms.map((room) => room.roomNumber));
      const availableRooms: number[] = [];
      for (let room = 1; room <= 10; room += 1) {
        if (!occupiedRooms.has(room)) {
          availableRooms.push(room);
        }
      }
      return availableRooms;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default MiscService;
