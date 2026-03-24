import assert from "node:assert/strict";
import test from "node:test";
import receivedAnnouncementResolver from "../../gql/resolvers/receivedAnnouncementResolver";
import { getDb, mockDbMethod } from "../helpers/mockDb";

test("getReceivedAnnouncements maps unread/pinned/important filters", async () => {
  const db = getDb();
  let capturedArgs: any = null;

  const restoreFindMany = mockDbMethod(
    db.receivedAnnouncement,
    "findMany",
    async (args: any) => {
      capturedArgs = args;
      return [];
    }
  );

  try {
    await receivedAnnouncementResolver.Query.getReceivedAnnouncements(
      undefined,
      {
        pid: 5,
        unread: true,
        pinned: true,
        important: true,
      }
    );

    assert.equal(capturedArgs.where.pid, 5);
    assert.equal(capturedArgs.where.read, false);
    assert.equal(capturedArgs.where.pinned, true);
    assert.deepEqual(capturedArgs.where.announcement.priority.in, [
      "HIGH",
      "CRITICAL",
    ]);
    assert.deepEqual(capturedArgs.orderBy, { announcement: { date: "desc" } });
  } finally {
    restoreFindMany();
  }
});

test("getReceivedAnnouncements maps important=false to NORMAL priority", async () => {
  const db = getDb();
  let capturedArgs: any = null;

  const restoreFindMany = mockDbMethod(
    db.receivedAnnouncement,
    "findMany",
    async (args: any) => {
      capturedArgs = args;
      return [];
    }
  );

  try {
    await receivedAnnouncementResolver.Query.getReceivedAnnouncements(
      undefined,
      {
        pid: 7,
        important: false,
      }
    );

    assert.equal(capturedArgs.where.pid, 7);
    assert.equal(capturedArgs.where.announcement.priority, "NORMAL");
  } finally {
    restoreFindMany();
  }
});

test("updateReceivedAnnouncement rejects when no updates provided", async () => {
  await assert.rejects(
    async () =>
      receivedAnnouncementResolver.Mutation.updateReceivedAnnouncement(
        undefined,
        {
          aid: 1,
          pid: 1,
        }
      ),
    /no updates received/
  );
});

test("updateReceivedAnnouncement sends nested key selector to db", async () => {
  const db = getDb();
  let capturedArgs: any = null;

  const restoreUpdate = mockDbMethod(
    db.receivedAnnouncement,
    "update",
    async (args: any) => {
      capturedArgs = args;
      return {
        aid: args.where.aid_pid.aid,
        pid: args.where.aid_pid.pid,
        pinned: args.data.pinned ?? false,
        read: args.data.read ?? false,
      };
    }
  );

  try {
    const result =
      await receivedAnnouncementResolver.Mutation.updateReceivedAnnouncement(
        undefined,
        {
          aid: 9,
          pid: 11,
          pinned: true,
        }
      );

    assert.deepEqual(capturedArgs.where, { aid_pid: { aid: 9, pid: 11 } });
    assert.equal(result.pinned, true);
  } finally {
    restoreUpdate();
  }
});
