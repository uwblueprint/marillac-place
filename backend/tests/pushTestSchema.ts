import { execSync } from "node:child_process";
import "./setup";

// Brings the test database's schema in line with schema.prisma, the same way
// the app's database gets its schema. Tests empty its tables themselves.
execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
