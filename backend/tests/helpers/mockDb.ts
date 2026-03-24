import db from "../../prisma";

type AnyFn = (...args: any[]) => any;

export function mockDbMethod<T extends AnyFn>(
  parent: Record<string, any>,
  method: string,
  implementation: T
) {
  const original = parent[method];
  parent[method] = implementation;
  return () => {
    parent[method] = original;
  };
}

export function getDb() {
  return db as unknown as Record<string, any>;
}
