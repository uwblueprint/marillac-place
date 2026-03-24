import db from "../../prisma";

type AnyFn = (...args: any[]) => any;

export function mockDbMethod<T extends AnyFn>(
  parent: Record<string, any>,
  method: string,
  implementation: T
) {
  /* eslint-disable no-param-reassign -- test helper swaps methods on a stub object */
  const original = parent[method];
  parent[method] = implementation;
  return () => {
    parent[method] = original;
  };
  /* eslint-enable no-param-reassign */
}

export function getDb() {
  return db as unknown as Record<string, any>;
}
