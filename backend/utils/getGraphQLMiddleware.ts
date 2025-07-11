const jwt = require("jsonwebtoken");

function verifyRole(allowedRoles: string[]) {
  return async function (
    resolve: any,
    parent: any,
    args: any,
    context: any,
    info: any
  ) {
    const authHeader = context.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new Error("Missing or invalid authorization header");
    }

    try {
      const TOKEN = authHeader.split(" ")[1];
      const JWT_SECRET = process.env.JWT_SECRET ?? "";
      const DATA: any = jwt.verify(TOKEN, JWT_SECRET);
      const { role } = DATA;

      if (!allowedRoles.includes(role)) {
        throw new Error("Request is not authorized");
      }

      return resolve(parent, args, context, info);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  };
}

export default function getGraphQLMiddleware() {
  const middleware = {
    Query: {
      getPastParticipants: verifyRole(["admin", "relief"]),
      getCurrentParticipants: verifyRole(["admin", "relief"]),
      getParticipantByRoom: verifyRole(["admin", "relief"]),
      getParticipantsByRooms: verifyRole(["admin", "relief"]),
      getNotes: verifyRole(["admin", "relief"]),
      getAllAnnouncements: verifyRole(["admin", "relief"]),
      getAnnouncementsInDateRange: verifyRole(["admin", "relief"]),
      getTasksByType: verifyRole(["admin", "relief"]),
      getCustomBadges: verifyRole(["admin", "relief"]),
    },
    Mutation: {
      createParticipant: verifyRole(["admin", "relief"]),
      updateParticipant: verifyRole(["admin", "relief"]),
      updateMarillacBucks: verifyRole(["admin", "relief"]),
      createNote: verifyRole(["admin", "relief"]),
      deleteNote: verifyRole(["admin", "relief"]),
      createAnnouncement: verifyRole(["admin", "relief"]),
      editAnnouncement: verifyRole(["admin", "relief"]),
      deleteAnnouncement: verifyRole(["admin", "relief"]),
      createTask: verifyRole(["admin", "relief"]),
      updateTask: verifyRole(["admin", "relief"]),
      deleteTaskById: verifyRole(["admin", "relief"]),
      editCustomBadge: verifyRole(["admin", "relief"]),
      assignCustomBadge: verifyRole(["admin", "relief"]),
      createCustomBadge: verifyRole(["admin", "relief"]),
      deleteCustomBadge: verifyRole(["admin", "relief"]),
      deleteAssignedTask: verifyRole(["admin", "relief"]),
      editAssignedTask: verifyRole(["admin", "relief"]),
    },
  };

  return middleware;
}
