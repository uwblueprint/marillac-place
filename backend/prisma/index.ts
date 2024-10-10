import {
  PrismaClient,
  UserType,
  TaskType,
  Status,
  RecurrenceFrequency,
  DaysOfWeek,
} from "@prisma/client";

export { UserType, TaskType, Status, RecurrenceFrequency, DaysOfWeek };

const prisma = new PrismaClient();

export default prisma;
