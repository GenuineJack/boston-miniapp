/**
 * Seed script — imports 49 spots from spots_seed.csv into the spots table.
 *
 * Usage:
 *   pnpm tsx scripts/seed-spots.ts
 *
 * Idempotent: skips rows that already exist by primary key (id).
 *
 * Before running, update SUBMITTER_FID and SUBMITTER_PFP_URL below
 * with the actual values for @genuinejack.
 */

import path from "path";
import fs from "fs";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

// genuinejack's Farcaster FID and profile picture URL.
// To find the FID: open https://warpcast.com/genuinejack and note the numeric FID
// shown in the URL or profile, OR query: https://api.neynar.com/v2/farcaster/user/by_username?username=genuinejack
// Then update both values below before running this script.
const SUBMITTER_FID = 218957; // genuinejack's Farcaster FID
const SUBMITTER_PFP_URL = "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/533a424d-d6f8-4c6a-30ec-7658555db700/original";

// ─── DB setup ────────────────────────────────────────────────────────────────

// Dynamic import to avoid top-level issues with Next.js server-only modules
const { db } = await import("../src/neynar-db-sdk/src/db.js");
const { spots } = await import("../src/db/schema.js");
const { eq } = await import("drizzle-orm");

// ─── CSV parser ──────────────────────────────────────────────────────────────

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    // Handle commas inside quoted fields
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        inQuotes = false;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = path.join(process.cwd(), "public", "spots_seed.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(content);

  console.log(`Found ${rows.length} rows in CSV`);

  // Get existing IDs to skip duplicates
  const existing = await db.select({ id: spots.id }).from(spots);
  const existingIds = new Set(existing.map((r) => r.id));
  console.log(`${existingIds.size} spots already in database`);

  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    const id = row["id"];
    if (!id) continue;

    if (existingIds.has(id)) {
      skipped++;
      continue;
    }

    const lat = row["latitude"] ? parseFloat(row["latitude"]) : null;
    const lng = row["longitude"] ? parseFloat(row["longitude"]) : null;
    const fid = SUBMITTER_FID || parseInt(row["submitted_by_fid"] ?? "0", 10);
    const pfpUrl = SUBMITTER_PFP_URL || row["submitted_by_pfp_url"] || null;
    const featured = row["featured"]?.toLowerCase() === "true";
    const createdAt = row["created_at"] ? new Date(row["created_at"]) : new Date();

    await db.insert(spots).values({
      id,
      name: row["name"] ?? "",
      category: row["category"] ?? "",
      subcategory: row["subcategory"] || null,
      neighborhood: row["neighborhood"] ?? "",
      description: row["description"] ?? "",
      address: row["address"] || null,
      link: row["link"] || null,
      latitude: lat,
      longitude: lng,
      submittedByFid: fid,
      submittedByUsername: row["submitted_by_username"] ?? "",
      submittedByDisplayName: row["submitted_by_display_name"] ?? "",
      submittedByPfpUrl: pfpUrl,
      featured,
      status: row["status"] ?? "approved",
      createdAt,
    });

    inserted++;
    console.log(`  ✓ ${row["name"]} (${row["neighborhood"]})`);
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped (already exists): ${skipped}`);

  // Verification: count by category and neighborhood
  const allSpots = await db.select().from(spots);
  const byCat: Record<string, number> = {};
  const byNbr: Record<string, number> = {};
  let featuredCount = 0;

  for (const spot of allSpots) {
    byCat[spot.category] = (byCat[spot.category] ?? 0) + 1;
    byNbr[spot.neighborhood] = (byNbr[spot.neighborhood] ?? 0) + 1;
    if (spot.featured) featuredCount++;
  }

  console.log("\n── By Category ──────────────────────");
  Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

  console.log("\n── By Neighborhood ──────────────────");
  Object.entries(byNbr)
    .sort((a, b) => b[1] - a[1])
    .forEach(([nbr, count]) => console.log(`  ${nbr}: ${count}`));

  console.log(`\n── Featured: ${featuredCount} / Total: ${allSpots.length} ──`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
