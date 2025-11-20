import jwt from "jsonwebtoken";
import { GraphQLResolveInfo } from "graphql";
import * as ROLES from "../constants/roles";

type ResolverFunction = (
  parent: unknown,
  args: Record<string, unknown>,
  context: { req: { headers: { authorization?: string } } },
  info: GraphQLResolveInfo
) => Promise<unknown> | unknown;

interface JWTPayload {
  role: string;
  [key: string]: unknown;
}

function verifyRole(allowedRoles: string[]) {
  return async function verifyRoleMiddleware(
    resolve: ResolverFunction,
    parent: unknown,
    args: Record<string, unknown>,
    context: { req: { headers: { authorization?: string } } },
    info: GraphQLResolveInfo
  ) {


    // Skip authentication in development mode for easier testing/refactoring
    if (process.env.NODE_ENV !== 'production') {
      return resolve(parent, args, context, info);
    } //remove before prod 

    const authHeader = context.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("missing or invalid authorization header");
    }

    try {
      const TOKEN = authHeader.split(" ")[1];
      const JWT_SECRET = process.env.JWT_SECRET ?? "";
      const DATA = jwt.verify(TOKEN, JWT_SECRET) as JWTPayload;
      const { role, pid } = DATA;

      if (!allowedRoles.includes(role)) {
        throw new Error("request is not authorized");
      }

      if (role === ROLES.PARTICIPANT) {
        const requestedPid = args.pid;
        if (!requestedPid || requestedPid !== pid) {
          throw new Error("participant is not authenticated");
        }
      }

      return resolve(parent, args, context, info);
    } catch (err) {
      throw new Error("invalid or expired token");
    }
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
