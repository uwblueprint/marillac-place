import jwt from "jsonwebtoken";
import { Participant, PrismaClient } from "@prisma/client";
import { evaluateBadge } from "../utils/evaluateBadge";
import { updateLoginStreak } from "../utils/updateLoginStreak";

const prisma = new PrismaClient();

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
      let storedPasswordHash = "";

      if (role === "admin") {
        storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD ?? "";
      } else if (role === "relief") {
        storedPasswordHash = process.env.RELIEF_STAFF_PASSWORD ?? "";
      } else {
        throw new Error("Role provided does not exist");
      }

      const isPasswordValid: boolean = password === storedPasswordHash;

      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      }

      const jwtSecretKey = process.env.JWT_SECRET ?? "";

      if (!jwtSecretKey) {
        throw new Error("Something went wrong");
      }

      const token = jwt.sign({ role }, jwtSecretKey, {
        expiresIn: "12h",
      });

      return { token };
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
      let participant: Participant | null = null;
      try {
        participant = await prisma.participant.findUnique({
          where: {
            participant_id: id,
            account_removal_date: null,
          },
        });
      } catch (err) {
        throw new Error("Something went wrong");
      }

      if (!participant) {
        throw new Error("ID # does not exist");
      }

      const isPasswordValid = password === participant.password;

      if (!isPasswordValid) {
        throw new Error("Password is incorrect");
      }

      const jwtSecretKey = process.env.JWT_SECRET ?? "";

      if (!jwtSecretKey) {
        console.error("JWT secret key not setup");
        throw new Error("Something went wrong");
      }

      const token = jwt.sign(
        {
          role: "participant",
          id,
        },
        jwtSecretKey,
        {
          expiresIn: "12h",
        }
      );

      try {
        const days = await updateLoginStreak(participant.participant_id);
        await evaluateBadge(days, id, "Log-in Badge");
      } catch (err) {
        console.error("Failed to record login:", err);
      }

      return { token };
    },
  },
};

export default loginResolver;
