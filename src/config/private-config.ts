import "server-only";
import { z } from "zod";

const privateConfigSchema = z.object({
  neynarApiKey: z
    .string()
    .min(1, "NEYNAR_API_KEY environment variable is required"),
  coingeckoApiKey: z.string(),
  seedSecret: z.string(),
});

const rawPrivateConfig = {
  neynarApiKey: process.env.NEYNAR_API_KEY || "",
  coingeckoApiKey: process.env.COINGECKO_API_KEY || "",
  seedSecret: process.env.SEED_SECRET || "",
};

const parsed = privateConfigSchema.safeParse(rawPrivateConfig);
if (!parsed.success) {
  console.warn("[config] private-config validation warnings:", parsed.error);
}

export const privateConfig = rawPrivateConfig;
