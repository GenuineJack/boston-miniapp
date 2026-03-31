# Boston Miniapp — Roadmap

## Implemented

### Infrastructure
- Auto-create all DB tables on startup (no manual drizzle-kit push needed in production)
- Auto-seed 63 curated spots if DB is empty — app works immediately after first deploy
- Build works without all env vars set locally (safeParse on config schemas)
- Google Fonts loaded at runtime — no build-time network dependency

### UX
- Tab bar: iOS safe area padding, 64px minimum touch targets, viewport-fit=cover
- Explore tab: category filter toggles off on second tap
- Explore tab: map collapses on scroll, "Show Map" pill to restore
- Deep linking: ?spotId= auto-opens spot detail sheet

### Today tab
- Live Boston time (Eastern, auto-updates)
- Local news feed: Universal Hub, WBUR, Boston Herald (30-min cache, fails silently)
- Live sports scores (ESPN)
- Community happenings

### Areas tab
- City neighborhoods (2-column grid) + Greater Boston regions (single column)
- Per-area detail view with inline spot strip and spot count
- Regions: North Shore, South Shore & Cape, Metro West, Central & Western Mass, Greater New England

### Content (63 spots at seed time)
- Back Bay, Beacon Hill, South End, North End, Seaport, Cambridge/Somerville
- Jamaica Plain, Allston/Brighton, Dorchester, East Boston, South Boston
- Fenway/Kenmore, Downtown, Brookline
- Roxbury, Mission Hill, Hyde Park, Roslindale, West Roxbury
- North Shore (Gloucester, Salem), South Shore (Duxbury, Quincy)

## Next Session

- [ ] Builder profile editing (Farcaster-gated)
- [ ] /admin page fully wired (approve/reject spots, moderate happenings)
- [ ] Social sharing — Farcaster cast with spot card image embed
- [ ] ?builderId= deep linking
- [ ] MBTA alerts strip in Today tab
- [ ] Error recovery on spot submission (retry + queue)
- [ ] First-run onboarding: persist dismiss state
- [ ] city.config.ts extraction — make app forkable for other cities
- [ ] Additional content: 50+ spots target, more Dorchester/Chinatown/South Boston coverage
