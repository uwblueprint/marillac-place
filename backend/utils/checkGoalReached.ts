import { PrismaClient } from "@prisma/client";
import { getToday } from "./formatDateTime";

const prisma = new PrismaClient();

/**
 * Checks if a participant has reached their current goal and records it if they have.
 * Should be called whenever marillac_bucks is updated.
 *
 * @param participant_id - The ID of the participant to check
 * @returns true if goal was reached and recorded, false otherwise
 */
export async function checkAndRecordGoalReached(
  participant_id: number
): Promise<boolean> {
  try {
    const participant = await prisma.participant.findUnique({
      where: { participant_id },
      select: {
        marillac_bucks: true,
        marillac_bucks_goal: true,
      },
    });

    // Participant doesn't exist
    if (!participant) {
      return false;
    }

    // No goal set
    if (!participant.marillac_bucks_goal) {
      return false;
    }

    // Goal not reached yet
    if (participant.marillac_bucks < participant.marillac_bucks_goal) {
      return false;
    }

    // Check if we've already recorded REACHED for this goal
    const alreadyRecorded = await prisma.$queryRaw`
      SELECT * FROM goal_history
      WHERE participant_id = ${participant_id}
        AND goal_action = 'REACHED'
        AND goal_value = ${participant.marillac_bucks_goal}
      ORDER BY action_date DESC
      LIMIT 1
    `;

    // Already recorded
    if (Array.isArray(alreadyRecorded) && alreadyRecorded.length > 0) {
      return false;
    }

    // Record that the goal was reached
    await prisma.$executeRaw`
      INSERT INTO goal_history (participant_id, goal_action, goal_value, action_date)
      VALUES (
        ${participant_id},
        'REACHED',
        ${participant.marillac_bucks_goal},
        ${getToday()}
      )
    `;

    // Optional: Clear the goal so participant can set a new one
    await prisma.participant.update({
      where: { participant_id },
      data: { marillac_bucks_goal: null },
    });

    return true;
  } catch (error) {
    console.error("Error checking goal reached:", error);
    return false;
  }
}
