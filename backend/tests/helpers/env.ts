export async function withEnv<T>(
  overrides: Record<string, string>,
  run: () => Promise<T> | T
): Promise<T> {
  const previousValues: Record<string, string | undefined> = {};

  Object.entries(overrides).forEach(([key, value]) => {
    previousValues[key] = process.env[key];
    process.env[key] = value;
  });

  try {
    return await run();
  } finally {
    Object.keys(overrides).forEach((key) => {
      const previous = previousValues[key];
      if (previous === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous;
      }
    });
  }
}
