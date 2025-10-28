import prisma from "../prisma";

// returns an error if badge not found
// if new level reached, returns true and create corresponding BadgeLevel object
// if not a new level, returns false and doesn't create anything
export async function evaluateBadge(
    current_benchmark: number,
    participant_id: number,
    badge_name: string
  ): Promise<boolean> {
    try {
      const badge = await prisma.badge.findUnique({
        where: { name: badge_name },
        include: {
          badge_level: true,
        },
      });
      if (!badge) throw new Error(`Badge not found.`);
      const earned = await prisma.earnedBadge.findFirst({
        where: { participant_id, name: badge_name },
        orderBy: {level: 'asc'},
      });
      const nextLevel = earned ? earned.level + 1 : 0;
      const nextLevelEntry = badge.badge_level.find(bl => bl.level === nextLevel);
      if (!nextLevelEntry) return false;
      if (current_benchmark >= nextLevelEntry.benchmark) {
        await prisma.earnedBadge.create({
          data: {
            badge_id: badge.badge_id,
            participant_id: participant_id,
            date_received: new Date().toISOString(),
            name: badge.name,
            description: badge.description,
            badge_icon: badge.icon,
            level: nextLevel,
          },
        });
        return true;
      } else return false;
    } catch (err) {
      // @ts-ignore
      throw new Error(err.message ||"Something went wrong");
    }
  }