/**
 * Next.js Instrumentation Hook
 *
 * Runs once on server startup (both dev and production).
 * Used to apply schema migrations that can't be handled by Drizzle push alone.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { runMigrations } = await import("@/db/migrations");
      await runMigrations();
    } catch (e) {
      // Non-fatal — app still starts even if migrations fail
      console.error("[instrumentation] Migration error:", e);
    }
  }
}
