import {
  PrismaClient,
  StaffType,
  TaskType,
  TaskStatus
} from "@prisma/client";

export { StaffType, TaskType, TaskStatus };

const prisma = new PrismaClient();

export default prisma;
