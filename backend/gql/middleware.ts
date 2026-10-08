import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";
import * as ROLES from "../constants/roles";
import { findCurrentParticipant } from "../utils/participantUtils";
import { getBearerToken, verifySessionToken } from "../utils/sessionUtils";

type ResolverFunction = (
  parent: unknown,
  args: Record<string, unknown>,
  context: { req: { headers: { authorization?: string } } },
  info: GraphQLResolveInfo
) => Promise<unknown> | unknown;

function verifyRole(allowedRoles: string[]) {
  return async function verifyRoleMiddleware(
    resolve: ResolverFunction,
    parent: unknown,
    args: Record<string, unknown>,
    context: { req: { headers: { authorization?: string } } },
    info: GraphQLResolveInfo
  ) {
    // Skip authentication in development mode for easier testing/refactoring
    if (process.env.NODE_ENV !== "production") {
      return resolve(parent, args, context, info);
    } // remove before prod

    const { claims } = verifySessionToken(
      getBearerToken(context.req.headers.authorization)
    );

    if (!allowedRoles.includes(claims.role)) {
      throw new ForbiddenError("request is not authorized");
    }

    if (claims.role === ROLES.PARTICIPANT) {
      if (args.pid !== claims.pid) {
        throw new ForbiddenError("participant is not authenticated");
      }
      // Sessions outlive a participant's stay, so check they haven't left.
      if (!(await findCurrentParticipant(claims.pid))) {
        throw new AuthenticationError("participant has departed");
      }
    }

    return resolve(parent, args, context, info);
  };
}

export default function getMiddleware() {
  const middleware = {
    Query: {
      getNotes: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getReportRecipients: verifyRole([ROLES.ADMIN]),
      getAnnouncementsFromToday: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getAnnouncementsSentToParticipants: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
      ]),
      getReceivedAnnouncements: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getEarningGoal: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getTasksByType: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getCustomBadges: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getWeeklyEarnings: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getCurrentParticipants: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getPastParticipants: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getSystemBadges: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getNumberOfAssignedTasksByRoom: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      getAssignedTasksForToday: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getAssignedTasksByWeek: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      hasCompletedAllRequiredTasks: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getEarnedCustomBadges: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getAchievedBadgeLevels: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
      getBadgeLevelProgress: verifyRole([
        ROLES.ADMIN,
        ROLES.RELIEF,
        ROLES.PARTICIPANT,
      ]),
    },
    Mutation: {
      createNote: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      deleteNote: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      createReportRecipient: verifyRole([ROLES.ADMIN]),
      updateReportRecipient: verifyRole([ROLES.ADMIN]),
      deleteReportRecipient: verifyRole([ROLES.ADMIN]),
      createAnnouncement: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateAnnouncement: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      deleteAnnouncement: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateReceivedAnnouncement: verifyRole([ROLES.PARTICIPANT]),
      createEarningGoal: verifyRole([ROLES.PARTICIPANT]),
      updateEarningGoal: verifyRole([ROLES.PARTICIPANT]),
      createTask: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      deleteTask: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      createCustomBadge: verifyRole([ROLES.ADMIN]),
      updateCustomBadge: verifyRole([ROLES.ADMIN]),
      deleteCustomBadge: verifyRole([ROLES.ADMIN]),
      createParticipant: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateParticipant: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateBalance: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      createEarnedCustomBadge: verifyRole([ROLES.ADMIN]),
      updateSystemBadge: verifyRole([ROLES.ADMIN]),
      updateBadgeLevel: verifyRole([ROLES.ADMIN]),
      createAssignedTask: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateAssignedTask: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      updateAssignedTaskStatus: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      deleteAssignedTask: verifyRole([ROLES.ADMIN, ROLES.RELIEF]),
      fetchNewAchievedBadgeLevels: verifyRole([ROLES.PARTICIPANT]),
      fetchNewEarnedCustomBadges: verifyRole([ROLES.PARTICIPANT]),
    },
  };

  return middleware;
}
