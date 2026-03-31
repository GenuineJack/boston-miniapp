/**
 * One-time migration: backfill links for all seeded spots.
 *
 * Usage:
 *   pnpm tsx scripts/backfill-links.ts
 */

export {};

// Map of spot ID → link URL
const SPOT_LINKS: Record<string, string> = {
  // Food & Drink
  "03baac4a-aedb-42c0-9b71-6008fa6b3ff4": "https://sarmarestaurant.com",          // Sarma
  "cd4d7d24-8b26-424f-967b-c75968e38360": "https://brassicakitchen.com",           // Brassica Kitchen + Café
  "3f922fc3-cc49-4897-8931-d88d2daeb36c": "https://row34.com",                     // Row 34
  "d5e10c8d-ea81-40ab-870a-4169c40b5ee5": "https://neptuneoyster.com",             // Neptune Oyster
  "f79638e8-e820-48b4-9bde-9513c1faf8d0": "https://toro-restaurant.com",           // Toro
  "7cfb9395-bbdf-4dc1-9584-a47e85a23cff": "https://www.szechuanmountainhouse.com", // Szechuan Mountain House
  "396675bc-9458-4a11-9403-3eb2be3da372": "https://www.phohoa.com",                // Pho Hoa
  "25e1fdb9-27c9-4944-99a1-0ffe4feecaeb": "https://www.instagram.com/cunardtavern", // Cunard Tavern
  "b1ffb207-dc3f-4b86-83e6-b4f703918249": "https://www.zuritoboston.com",          // Zurito
  "ce15464c-3070-47c5-a3fd-1a693d82ec56": "https://mammamaria.com",                // Mamma Maria
  "4d1e825e-9005-40e3-9f9c-f97c4b107281": "https://myersandchang.com",             // Myers + Chang
  "1c31dc7b-caac-4c3c-95ba-0bb441ecd1c5": "https://www.thedailycatch.com",         // The Daily Catch
  "63d55eac-1249-4760-aec8-fd8b4cbe3db1": "https://www.kaiarestaurant.com",        // Kaia
  "d5cad8cb-d6ff-48ae-85ab-7680a9804ba0": "https://www.celesteboston.com",         // Celeste
  "a1663de9-ec33-4d28-a832-098ca75a0798": "https://flourbakery.com",               // Flour Bakery
  "1334112a-fc03-4922-817a-be02ba3d5dcc": "https://southendbuttery.com",           // South End Buttery

  // Coffee
  "82bacf2a-a408-4d3b-b7ff-bdb8c11fff4b": "https://www.tattebakery.com",           // Tatte Bakery
  "e45282ff-e936-4ce9-aeeb-4265c041a05f": "https://georgehowellcoffee.com",        // George Howell Coffee
  "0ed71c05-6edd-4e4e-9ce9-867a1393dea8": "https://www.gracenotecoffee.com",       // Gracenote Coffee
  "772fddc4-7b94-4c2b-a23e-c1a0e23d29aa": "https://www.rendercoffee.com",          // Render Coffee
  "d7a43662-d27f-4f2d-a310-9732dedc9c3b": "https://www.ogawacoffee.com",           // Ogawa Coffee
  "890d73cf-57dc-45cc-b01a-f76ba6b05ce1": "https://www.thinkingcup.com",           // Thinking Cup
  "6977eb02-3b23-4371-bda4-a9eaf42479f2": "https://www.caffevittoria.com",         // Caffè Vittoria

  // Nightlife / Bars
  "c1ab0536-9f28-4362-83b0-47ee42dcdde5": "https://backbarinc.com",                // Backbar
  "b2029994-0db2-4d5a-910f-e8afd941bdb3": "https://www.yvonnesboston.com",         // Yvonne's
  "67dc1d9b-de5e-406e-a505-06fc9e2c36ab": "https://beehiveboston.com",             // The Beehive
  "418e2b4b-cbc8-4d40-90c1-be5f489c4a9b": "https://www.carrienationboston.com",    // Carrie Nation
  "d350b0ae-9595-40ab-940b-ccc7b0073a2e": "https://www.cantablounge.com",          // The Cantab Lounge
  "2ee437a1-5d38-4ca2-b0ef-3e66a6a14c9a": "https://www.instagram.com/89charlesst", // 89 Charles
  "241d4bb5-cf44-4bfc-a625-5618b34ec7b4": "https://clubcafe.com",                  // Club Café
  "f9fc86d5-151f-4c48-9efd-4fee0db610ae": "https://www.instagram.com/tallshipbar", // Tall Ship

  // Outdoors
  "4cc21c61-70ba-4433-a503-418f049d1ffc": "https://arboretum.harvard.edu",         // Arnold Arboretum
  "eac28729-5066-4eb9-b562-45494aec4195": "https://www.bostonharborboats.com/castle-island", // Castle Island
  "efc26810-9d2f-45ab-af22-7aa8337c2512": "https://www.esplanadeassociation.org",  // Esplanade
  "a2408b4f-1f30-45d7-b647-ae781b861144": "https://www.boston.gov/parks/boston-common", // Boston Common & Public Garden
  "34d8d1c8-a025-4ac0-96b0-3bf229ae8bd9": "https://www.bostonharborwalk.com/pierspark", // Piers Park
  "b7f87346-487d-455f-8ef0-fe969233cd27": "https://www.cambridgema.gov/CDD/parks/freshpond", // Fresh Pond Reservation

  // Culture
  "ff7f22e0-bc61-45a7-a64f-e449e13d2459": "https://www.icaboston.org",             // Institute of Contemporary Art
  "2922e181-f9c5-4515-9510-7e457019c071": "https://www.gardnermuseum.org",         // Isabella Stewart Gardner Museum
  "308da953-26c3-4a3b-9d58-46aa7b74e268": "https://www.mfa.org",                   // Museum of Fine Arts
  "42723260-d6ad-4847-8fea-7912faeab579": "https://www.brattlefilm.org",           // Brattle Theatre
  "b83d3830-a429-4c77-a23a-e45e4da39c59": "https://www.coolidge.org",              // Coolidge Corner Theatre
  "df11958e-8b4a-4c23-b5e1-58076b02823c": "https://www.sowaboston.com",            // SoWa Open Market
  "06da5182-8858-4d63-9888-1cd9e0746628": "https://www.newburystreet.com",         // Newbury Street
  "504d0e1b-4a9a-4f69-bd64-845a40c92597": "https://www.harvard.com",               // Harvard Book Store
  "1bd0ed5c-62eb-49db-8709-30e0bd51cc76": "https://www.bpl.org",                   // Boston Public Library
  "ecda3024-373d-427c-807f-0b52f21b107b": "https://marybakereddylibrary.org/project/mapparium", // Mapparium
  "968afbd6-e6cd-439b-a4a8-76d858899ec2": "https://www.massgeneral.org/museum/ether-dome",  // Ether Dome
  "0d9e270e-6ebe-441d-9e86-debdff657375": "https://www.samueladamsbrewery.com",    // Sam Adams Brewery
};

async function main() {
  const { db } = await import("../src/neynar-db-sdk/src/db.js");
  const { spots } = await import("../src/db/schema.js");
  const { eq } = await import("drizzle-orm");

  let updated = 0;

  for (const [id, link] of Object.entries(SPOT_LINKS)) {
    await db.update(spots).set({ link }).where(eq(spots.id, id));
    updated++;
  }

  console.log(`Updated ${updated} spots with links.`);

  // Verify
  const all = await db.select({ name: spots.name, link: spots.link }).from(spots);
  const withLink = all.filter((r) => r.link);
  const without = all.filter((r) => !r.link);
  console.log(`\nWith link: ${withLink.length} / Without: ${without.length}`);
  if (without.length > 0) {
    without.forEach((r) => console.log(`  Still null: ${r.name}`));
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
