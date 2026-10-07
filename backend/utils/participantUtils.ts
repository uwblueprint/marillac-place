import { Participant, Prisma } from "@prisma/client";
import db from "../prisma";
import { getEndOfDay } from "./dateUtils";

// Participants who haven't moved out yet (departure, if set, is after today).
export function currentParticipantFilter(): Prisma.ParticipantWhereInput {
  return {
    OR: [{ departure: null }, { departure: { gt: getEndOfDay(new Date()) } }],
  };
}

export function findCurrentParticipant(
  pid: number
): Promise<Participant | null> {
  return db.participant.findFirst({
    where: { pid, ...currentParticipantFilter() },
  });
}
