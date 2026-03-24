import assert from "node:assert/strict";
import test from "node:test";
import participantResolver from "../../gql/resolvers/participantResolver";
import { getDb, mockDbMethod } from "../helpers/mockDb";

test("createParticipant rejects if participant id already exists", async () => {
  const db = getDb();
  const restoreFindUnique = mockDbMethod(
    db.participant,
    "findUnique",
    async () => ({ pid: 1 })
  );

  try {
    await assert.rejects(
      async () =>
        participantResolver.Mutation.createParticipant(undefined, {
          pid: 1,
          password: "pw",
          room: 1,
          arrival: new Date().toISOString(),
        }),
      /participant id already exists/
    );
  } finally {
    restoreFindUnique();
  }
});

test("createParticipant rejects future arrival date", async () => {
  const db = getDb();
  const restoreFindUnique = mockDbMethod(
    db.participant,
    "findUnique",
    async () => null
  );

  try {
    await assert.rejects(
      async () =>
        participantResolver.Mutation.createParticipant(undefined, {
          pid: 2,
          password: "pw",
          room: 1,
          arrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      /arrival is in the future/
    );
  } finally {
    restoreFindUnique();
  }
});

test("createParticipant rejects if room is occupied", async () => {
  const db = getDb();
  const restoreFindUnique = mockDbMethod(
    db.participant,
    "findUnique",
    async () => null
  );
  const restoreFindFirst = mockDbMethod(
    db.participant,
    "findFirst",
    async () => ({ pid: 999 })
  );

  try {
    await assert.rejects(
      async () =>
        participantResolver.Mutation.createParticipant(undefined, {
          pid: 3,
          password: "pw",
          room: 1,
          arrival: new Date().toISOString(),
        }),
      /room is occupied/
    );
  } finally {
    restoreFindUnique();
    restoreFindFirst();
  }
});

test("updateParticipant rejects if no updates provided", async () => {
  await assert.rejects(
    async () =>
      participantResolver.Mutation.updateParticipant(undefined, {
        pid: 1,
      }),
    /no updates received/
  );
});

test("updateParticipant rejects invalid room number", async () => {
  await assert.rejects(
    async () =>
      participantResolver.Mutation.updateParticipant(undefined, {
        pid: 1,
        room: 50,
      }),
    /room must be between 1 and 10/
  );
});

test("updateParticipant sends updates to db", async () => {
  const db = getDb();
  const expected = {
    pid: 4,
    password: "updated",
    room: 3,
  };

  const restoreUpdate = mockDbMethod(
    db.participant,
    "update",
    async ({ where, data }: { where: { pid: number }; data: any }) => ({
      pid: where.pid,
      ...data,
    })
  );

  try {
    const updated = await participantResolver.Mutation.updateParticipant(
      undefined,
      { pid: 4, password: "updated", room: 3 }
    );
    assert.equal(updated.pid, expected.pid);
    assert.equal(updated.password, expected.password);
    assert.equal(updated.room, expected.room);
  } finally {
    restoreUpdate();
  }
});
