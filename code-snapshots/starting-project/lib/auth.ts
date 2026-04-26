import { betterAuth } from "better-auth";
import { mkdirSync } from "fs";
import { headers } from "next/headers";
import { db } from "./db";

mkdirSync("data", { recursive: true });

// bun:sqlite shim to match the better-sqlite3 interface better-auth expects
const dbShim = {
  prepare(sql: string) {
    const stmt = db.prepare(sql);
    return {
      run(...params: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stmt.run(...(params as any[]));
        return { changes: 0, lastInsertRowid: 0 };
      },
      get(...params: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return stmt.get(...(params as any[]));
      },
      all(...params: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return stmt.all(...(params as any[]));
      },
    };
  },
  exec(sql: string) {
    db.run(sql);
  },
};

export const auth = betterAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  database: dbShim as any,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
});

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
