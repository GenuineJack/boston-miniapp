/**
 * One-time migration: update all spots with submitted_by_fid = 0
 * and submitted_by_username = 'genuinejack' to use the correct FID.
 *
 * Usage:
 *   pnpm tsx scripts/fix-fid-zero.ts
 */

export {};

const ACTUAL_FID = 218957;
const ACTUAL_PFP_URL =
  "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/533a424d-d6f8-4c6a-30ec-7658555db700/original";

async function main() {
  const { db } = await import("../src/neynar-db-sdk/src/db.js");
  const { spots } = await import("../src/db/schema.js");
  const { eq, and } = await import("drizzle-orm");

  await db
    .update(spots)
    .set({ submittedByFid: ACTUAL_FID, submittedByPfpUrl: ACTUAL_PFP_URL })
    .where(and(eq(spots.submittedByFid, 0), eq(spots.submittedByUsername, "genuinejack")));

  console.log("Updated spots with FID 0 → 218957 (@genuinejack)");

  // Verify
  const updated = await db
    .select({ id: spots.id, name: spots.name, fid: spots.submittedByFid })
    .from(spots)
    .where(eq(spots.submittedByFid, ACTUAL_FID));

  console.log(`\nNow have ${updated.length} spot(s) attributed to @genuinejack (FID ${ACTUAL_FID}):`);
  for (const row of updated) {
    console.log(`  ✓ ${row.name}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
