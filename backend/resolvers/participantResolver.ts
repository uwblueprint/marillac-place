import { Participant, Prisma, PrismaClient } from "@prisma/client";
import { getToday } from "../utils/formatDateTime";
import { checkAndRecordGoalReached } from "../utils/checkGoalReached";

const prisma = new PrismaClient();

enum GoalAction {
  SET = "SET",
  REACHED = "REACHED",
}

const participantResolver = {
  Query: {
    getCurrentParticipants: async (): Promise<Participant[]> => {
      const participants = await prisma.participant.findMany({
        where: {
          OR: [
            { departure_date: null },
            { departure_date: { gt: getToday() } },
          ],
        },
        orderBy: [{ room_number: "asc" }],
      });
      return participants;
    },
    getPastParticipants: async (): Promise<Participant[]> => {
      const participants = await prisma.participant.findMany({
        where: {
          departure_date: {
            not: null,
            lte: getToday(),
          },
        },
        orderBy: [{ departure_date: "desc" }],
      });
      return participants;
    },
    getParticipantByRoom: async (
      _parent: undefined,
      { room_number }: { room_number: number }
    ): Promise<Participant | null> => {
      try {
        return await prisma.participant.findFirst({
          where: {
            AND: [
              { room_number },
              {
                OR: [
                  { departure_date: null },
                  { departure_date: { gt: getToday() } },
                ],
              },
            ],
          },
          include: {
            assigned_tasks: true,
          },
        });
      } catch (error) {
        throw new Error("Failed to get participant by room");
      }
    },
    getParticipantsByRooms: async (
      _parent: undefined,
      { room_numbers }: { room_numbers: number[] }
    ): Promise<Participant[]> => {
      try {
        return await prisma.participant.findMany({
          where: {
            AND: [
              { room_number: { in: room_numbers } },
              {
                OR: [
                  { departure_date: null },
                  { departure_date: { gt: getToday() } },
                ],
              },
            ],
          },
        });
      } catch (error) {
        throw new Error("Failed to get participants by rooms");
      }
    },
    getParticipantById: async (
      _parent: undefined,
      { participantId }: { participantId: number }
    ): Promise<Participant | null> => {
      return prisma.participant.findUnique({
        where: {
          participant_id: participantId,
        },
      });
    },
    getGoalHistoryByParticipant: async (
      _parent: undefined,
      {
        participant_id,
        start_date,
        end_date,
      }: {
        participant_id: number;
        start_date?: string;
        end_date?: string;
      }
    ) => {
      const result = await prisma.$queryRaw`
        SELECT * FROM goal_history
        WHERE participant_id = ${participant_id}
          ${
            start_date
              ? Prisma.sql`AND action_date >= ${start_date}`
              : Prisma.empty
          }
          ${
            end_date ? Prisma.sql`AND action_date <= ${end_date}` : Prisma.empty
          }
        ORDER BY action_date DESC
      `;

      return result;
    },
  },
  Mutation: {
    createParticipant: async (
      _parent: undefined,
      {
        participant_id,
        room_number,
        arrival_date,
        password,
      }: {
        participant_id: number;
        room_number: number;
        arrival_date: string;
        password: string;
      }
    ): Promise<boolean> => {
      let existingParticipant: Participant | null = null;

      existingParticipant = await prisma.participant.findUnique({
        where: { participant_id },
      });

      if (existingParticipant) {
        throw new Error("Participant already exists");
      }

      let occupiedRoom: Participant | null = null;

      occupiedRoom = await prisma.participant.findFirst({
        where: {
          room_number,
          OR: [
            { departure_date: null },
            { departure_date: { gte: getToday() } },
          ],
        },
      });

      if (occupiedRoom) {
        throw new Error("Room is occupied");
      }

      await prisma.participant.create({
        data: {
          participant_id,
          room_number,
          arrival_date,
          password,
          account_creation_date: getToday(),
          participant_progress: {
            create: {},
          },
        },
      });
      return true;
    },
    updateParticipant: async (
      _parent: undefined,
      {
        participant_id,
        room_number,
        arrival_date,
        departure_date,
        account_creation_date,
        account_removal_date,
        marillac_bucks,
        marillac_bucks_goal,
        password,
      }: {
        participant_id: number;
        room_number?: number;
        arrival_date?: string;
        departure_date?: string;
        account_creation_date?: string;
        account_removal_date?: string;
        marillac_bucks?: number;
        marillac_bucks_goal?: number;
        password?: string;
      }
    ): Promise<boolean> => {
      const updatedData: Partial<Participant> = {};
      if (room_number) updatedData.room_number = room_number;
      if (arrival_date) updatedData.arrival_date = arrival_date;
      if (departure_date) updatedData.departure_date = departure_date;
      if (account_creation_date)
        updatedData.account_creation_date = account_creation_date;
      if (account_removal_date)
        updatedData.account_removal_date = account_removal_date;
      if (marillac_bucks) updatedData.marillac_bucks = marillac_bucks;
      if (marillac_bucks_goal)
        updatedData.marillac_bucks_goal = marillac_bucks_goal;
      if (password) updatedData.password = password;

      await prisma.participant.update({
        where: { participant_id },
        data: updatedData,
      });

      return true;
    },
    updateMarillacBucks: async (
      _parent: undefined,
      {
        participant_id,
        marillac_bucks,
        reason: _reason,
      }: {
        participant_id: number;
        marillac_bucks: number;
        reason: string;
      }
    ): Promise<boolean> => {
      await prisma.participant.update({
        where: { participant_id },
        data: { marillac_bucks },
      });

      // Check if this update caused the participant to reach their goal
      await checkAndRecordGoalReached(participant_id);

      return true;
    },
    setMarillacBucksGoal: async (
      _parent: undefined,
      {
        participant_id,
        goal_value,
      }: {
        participant_id: number;
        goal_value: number;
      }
    ): Promise<boolean> => {
      console.log("🎯 Backend: setMarillacBucksGoal called");
      console.log("📋 Params:", { participant_id, goal_value });

      if (goal_value <= 0) {
        console.error("❌ Invalid goal value:", goal_value);
        throw new Error("Goal value must be greater than 0");
      }

      console.log("✅ Updating participant goal...");
      await prisma.participant.update({
        where: { participant_id },
        data: { marillac_bucks_goal: goal_value },
      });
      console.log("✅ Participant goal updated");

      console.log("✅ Inserting into goal_history...");
      await prisma.$executeRaw`
        INSERT INTO goal_history (participant_id, goal_action, goal_value, action_date)
        VALUES (${participant_id}, 'SET', ${goal_value}, ${getToday()})
      `;
      console.log("✅ Goal history recorded");

      console.log("🎯 Goal successfully set!");
      return true;
    },
    updateMarillacBucksGoal: async (
      _parent: undefined,
      {
        participant_id,
        new_goal_value,
      }: {
        participant_id: number;
        new_goal_value: number;
      }
    ): Promise<boolean> => {
      const participant = await prisma.participant.findUnique({
        where: { participant_id },
      });

      if (!participant) {
        throw new Error("Participant not found");
      }

      if (new_goal_value <= participant.marillac_bucks) {
        throw new Error(
          "Goals must be greater than current Marillac Bucks Balance"
        );
      }

      await prisma.participant.update({
        where: { participant_id },
        data: { marillac_bucks_goal: new_goal_value },
      });

      await prisma.$executeRaw`
        INSERT INTO goal_history (participant_id, goal_action, goal_value, action_date)
        VALUES (${participant_id}, 'SET', ${new_goal_value}, ${getToday()})
      `;

      return true;
    },
  },
};

export default participantResolver;
