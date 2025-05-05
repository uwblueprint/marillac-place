import verifyRole from "./verifyRole";

export default function getGraphQLMiddleware() {
  const middleware = {
    Query: {
    },
    Mutation: {
      // addParticipant: verifyRole(["admin", "relief"]),
    },
  }

  return middleware;
}