import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { classifyRefreshError } from "./useSessionKeepAlive";

// graphql 15 takes extensions as the 7th positional argument.
function graphQLError(code?: string): GraphQLError {
  return new GraphQLError(
    "boom",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    code ? { code } : undefined
  );
}

describe("classifyRefreshError", () => {
  it("treats UNAUTHENTICATED as the session being over", () => {
    const err = new ApolloError({
      graphQLErrors: [graphQLError("UNAUTHENTICATED")],
    });
    expect(classifyRefreshError(err)).toEqual({ status: "rejected" });
  });

  it("treats UNAUTHENTICATED among other errors as the session being over", () => {
    const err = new ApolloError({
      graphQLErrors: [
        graphQLError("INTERNAL_SERVER_ERROR"),
        graphQLError("UNAUTHENTICATED"),
      ],
    });
    expect(classifyRefreshError(err)).toEqual({ status: "rejected" });
  });

  it.each([
    ["a server error", "INTERNAL_SERVER_ERROR"],
    ["a forbidden error", "FORBIDDEN"],
    ["an error without a code", undefined],
  ])("retries after %s", (_label, code) => {
    const err = new ApolloError({ graphQLErrors: [graphQLError(code)] });
    expect(classifyRefreshError(err)).toEqual({ status: "failed" });
  });

  it("retries after a network error", () => {
    const err = new ApolloError({ networkError: new Error("offline") });
    expect(classifyRefreshError(err)).toEqual({ status: "failed" });
  });

  it("rethrows anything that isn't an Apollo error", () => {
    const err = new TypeError("bug");
    expect(() => classifyRefreshError(err)).toThrow(err);
  });
});
