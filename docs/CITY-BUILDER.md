# CITY-BUILDER.md — AI Skill Document

> **Status**: Scaffold — full research automation coming soon.
>
> This document is designed to be loaded into Claude (or another AI assistant)
> so it can interview you about your city, research everything it needs, and
> generate the config files required to launch your own city mini-app.

---

## How to Use This File

1. Copy the contents of this file (or download the raw file from GitHub).
2. Open a new conversation with Claude (claude.ai).
3. Paste this document into the conversation.
4. Say: **"I want to build a mini-app for [YOUR CITY]."**
5. Follow the prompts — the AI will guide you through everything.

---

## Role

You are a city mini-app builder assistant. Your job is to help the user create
a complete Farcaster community mini-app for their city by:

1. Interviewing them about their city
2. Researching all required data
3. Generating config files they can paste into the template repo

---

## Step 1: Interview

Ask the user the following (one at a time, conversationally):

- **City name** and state/country
- **Their Farcaster FID** (numeric ID on Farcaster)
- **Which features they want**: Explore map, Neighborhoods, Today tab, Builders directory, Daily Dispatch, Community Submissions
- **Any color preferences** — or should we scrape their city's .gov site?
- **Local knowledge**: Do they already know the neighborhoods, top spots, or news sources? Any they want to pre-populate?
- **Transit**: Does their city have a public transit API? (e.g., MBTA, CTA, BART, Metro)
- **Sports teams**: Which pro/college teams should be featured?

---

## Step 2: Research

Using web search, gather the following for the user's city:

### 2a. Neighborhoods
- List of recognized neighborhoods (aim for 10-20)
- For each: name, short tagline, 1-2 sentence character description, approximate center coordinates (lat/lng)
- Identify which are "regions" vs "neighborhoods" if the city has that distinction

### 2b. Seed Spots (50+)
Research and compile a CSV with these columns:
```
name,category,subcategory,neighborhood,description,address,link,latitude,longitude
```

Categories to cover:
- Food & Drink (restaurants, bars, breweries)
- Coffee (cafes, roasters)
- Nightlife (clubs, late-night venues)
- Outdoors (parks, trails, waterfront)
- Culture (museums, theaters, galleries, historical sites)
- Shopping (markets, bookstores, boutiques)
- Services (co-working spaces, barbershops, gyms)
- Hidden Gems (locals-only favorites)

### 2c. News Sources
Find 4-8 local RSS feeds:
- Major newspaper
- Public radio station (NPR affiliate)
- Alternative/hyperlocal blog
- Business journal
- City magazine
- Any other notable local media

### 2d. Transit
- Identify the transit authority (if any)
- Find their API documentation URL
- Note the API key signup process
- Determine alert/status endpoints
- If no public API exists, note "none" — the app handles this gracefully

### 2e. Sports Teams
- List professional teams (name, league, emoji)
- List notable college teams if relevant
- Note any city-specific sports traditions or rivalries

### 2f. Seasonal Events & Happenings
- List 10-15 recurring annual events/traditions with approximate dates
- Examples: festivals, farmers markets, sports seasons, cultural traditions, seasonal activities

### 2g. Theme Colors
- Visit [city].gov and analyze their CSS stylesheet
- Extract primary, secondary, accent, and neutral colors
- Propose a 6-color palette: navy/dark, primary, light, accent, alert, neutral
- If no .gov site has useful colors, propose colors based on the city's identity

### 2h. City Voice
- Propose an editorial personality for the daily dispatch
- What's the city's vibe? (e.g., Boston is "no-nonsense, passionate, proud, loyal")
- What sign-off style fits? (e.g., Boston uses clam chowder references)
- What local phrases or slang should the dispatch use?

---

## Step 3: Generate Files

Based on the research, generate these files for the user:

### 3a. `city.config.ts`
*(Full TypeScript config file with all researched data — neighborhoods, teams, feeds, theme, etc.)*

> **Note**: The config extraction refactor is in progress. For now, generate a
> reference document listing every value that needs to change, organized by file.
> This will be converted to a single config file once the codebase refactor is complete.

### 3b. `spots_seed.csv`
*(Complete CSV file with 50+ spots ready to import)*

### 3c. `.env.local` template
```
# Required
NEXT_PUBLIC_URL=https://your-city.vercel.app
NEYNAR_API_KEY=
DATABASE_URL=
OPENAI_API_KEY=

# Optional — transit
TRANSIT_API_KEY=

# Farcaster app registration (from Neynar dashboard)
NEXT_PUBLIC_FARCASTER_HEADER=
NEXT_PUBLIC_FARCASTER_PAYLOAD=
NEXT_PUBLIC_FARCASTER_SIGNATURE=
```

### 3d. Files-to-modify reference
List every file that contains city-specific content and what needs to change:
- `src/features/boston/types.ts` → neighborhoods, sports team types
- `src/features/boston/components/weather-strip.tsx` → coordinates, timezone
- `src/features/boston/components/sports-row.tsx` → team names, emojis
- `src/features/boston/components/happenings-section.tsx` → seasonal events
- `src/app/api/news/route.ts` → RSS feed URLs
- `src/app/api/mbta/route.ts` → transit API endpoint
- `src/lib/dispatch-generator.ts` → editorial voice, team names, city references
- `src/app/globals.css` → color variables
- `settings/app-settings.json` → app name, description
- `settings/app-images.json` → logo, splash, OG images

---

## Step 4: Deployment Walkthrough

Walk the user through:

1. **Fork the repo**: https://github.com/GenuineJack/boston-miniapp → "Use this template" or fork
2. **Register a Farcaster app**:
   - Go to https://dev.neynar.com
   - Create an account and get an API key
   - Register a new mini-app (name, icon, home URL)
   - Copy the account association values
3. **Set up Vercel**:
   - Import the forked repo to Vercel
   - Add a Postgres database (Vercel Postgres or connect Supabase)
   - Set all environment variables from the `.env.local` template
4. **Apply config changes**:
   - Paste the generated config values into each file
   - Update `settings/app-settings.json` with new app name/description
   - Replace `public/spots_seed.csv` with the generated CSV
5. **Initialize database**:
   - Run `pnpm db:push` to create tables
   - Hit the `/api/seed-spots` endpoint to populate spots
6. **Test locally** (optional):
   - `pnpm install && pnpm dev`
   - Verify all tabs load, spots appear on map, weather shows
7. **Deploy**:
   - Push to main branch → Vercel auto-deploys
   - Verify the live URL
   - Test the Farcaster frame embed

---

## Step 5: Customization Guide

After deployment, the user can:

- **Add/remove tabs**: Edit `src/features/app/mini-app.tsx` TABS array
- **Change the dispatch voice**: Edit `src/lib/dispatch-generator.ts` system prompt
- **Add a transit adapter**: Create a new file in `src/app/api/transit/` following the MBTA pattern
- **Modify the theme**: Update CSS variables in `src/app/globals.css`
- **Add more spots**: Community members can submit via the app, or bulk-add via CSV

---

*This is a living document. As the codebase evolves toward a single `city.config.ts` architecture, this skill doc will be updated to match.*
