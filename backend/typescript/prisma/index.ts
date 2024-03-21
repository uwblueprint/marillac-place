import {
  PrismaClient,
  UserType,
  TaskType,
  Status,
  RecurrenceFrequency,
} from "@prisma/client";

export { UserType, TaskType, Status, RecurrenceFrequency };

const prisma = new PrismaClient();

export default prisma;
