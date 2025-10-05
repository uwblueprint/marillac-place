import { Participant, PrismaClient } from "@prisma/client";
import { getToday } from "../utils/formatDateTime";

const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const loginResolver = {
  Mutation: {
    adminLogin: async (
      _parent: undefined,
      {role, password}: {
        role: string;
        password: string;
      },
    ) => {
      var storedPasswordHash = "";

      if (role === "admin") {
        storedPasswordHash = process.env.ADMIN_STAFF_PASSWORD ?? "";
      } else if (role === "relief") {
        storedPasswordHash = process.env.RELIEF_STAFF_PASSWORD ?? "";
      } else {
        throw new Error('Role provided does not exist');
      }

      const isPasswordValid: boolean = password === storedPasswordHash;

      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      const jwtSecretKey = process.env.JWT_SECRET ?? "";

      if (!jwtSecretKey) {
        throw new Error('Something went wrong');
      }

      const token = jwt.sign(
        { role },
        jwtSecretKey,
        {
          expiresIn: "12h",
        },
      );

      return { token };
    },
    participantLogin: async (
      _parent: undefined,
      {id, password}: {
        id: number;
        password: string;
      },
    ) => {
      var participant: Participant | null = null;
      participant = await prisma.participant.findUnique({
        where: {
          participant_id: id,
          OR: [{ departure_date: null }, { departure_date: { gt: getToday() } }],
        },
      });

      if (!participant) {
        throw new Error('ID # does not exist');
      }

      const isPasswordValid = password === participant.password;

      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      const jwtSecretKey = process.env.JWT_SECRET ?? "";

      if (!jwtSecretKey) {
        console.error("JWT secret key not setup");
        throw new Error('Something went wrong');
      }

      const token = jwt.sign(
        {
          role: "participant",
          id
        },
        jwtSecretKey,
        {
          expiresIn: "12h",
        },
      );

      return { token };
    },
  },
};

export default loginResolver;
