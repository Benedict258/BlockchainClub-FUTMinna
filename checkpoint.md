# BlockchainClub FUTMinna — Project Checkpoint

**Date:** July 21, 2026  
**Commit:** `c384ff5`

## Current State

### Server
- Running on port 5180 (dev server via node)
- Public URL: `http://152.67.149.134:5180`
- Vercel production: `https://onchainfutminna.xyz`

### Platform Features Completed

| Feature | Status |
|---------|--------|
| Auth (register, login, verify, forgot/reset) | Done |
| User profiles (avatar, phone, username, bio, skills) | Done |
| Events (listing, detail, RSVP, admin CRUD, request form) | Done |
| Projects (listing, detail, submit, admin approve, featured) | Done |
| Blog (listing, detail, admin CRUD) | Done |
| Learn (curriculum browser, track detail, modules, Markdown) | Done |
| Leaderboard (points, badges, rankings) | Done |
| Admin dashboard (analytics, CRUD pages) | Done |
| Gamification (30+ point actions, 18 badges, levels, streaks) | Done |
| Multiplayer (squads, peer reviews, pair programming, hackathon teams) | Done |
| Challenges / Arena (8 challenge types, wager system, voting, badges) | Done |
| Opportunities + Partners | Done |
| Intake assessment | Done |
| DEVLOG system | Done |
| Gate checks + Cohorts | Done |
| Certifications + Alumni directory | Done |

### Blockchain
- Sui Move contract deployed on testnet
- PackageID: `0xd4632758a5cf176469ef34d71808aeccbf3b30aea3bab18509e2a89930426d4a`
- Admin wallet: `0x01d65891204c9a6d5f1f6f0f93ceca8952fee2769ce2fdec887183c2624647d3`

### Landing Page
- Hero with image carousel (slide1.jpg, slide2.jpg)
- Stats bar centered
- CORE PILLARS section
- Upcoming deployments (dynamic from DB)
- Past events (static with cover images)
- Featured projects (Ayorithm, VoiceGuard, Stripe3)
- Community links (X/Twitter, Telegram, WhatsApp, Discord) with SVG logos
- Image carousel with 5s auto-slide

### Database
- All 7 phases of tables created
- Performance indexes added
- Leaderboard materialized view
- 3 events seeded (Liquidity Campus Tour, Vibe-Coding, Onboarding)
- 5 projects seeded (Ayorithm, VoiceGuard, Stripe3, FuFi Vault, Aura)

### Responsive Design
- All pages responsive (mobile-first with `px-4 sm:px-6`)
- Site-wide max-width: 1400px
- Tailwind dark theme (purple #C084FC accent)

### Key URLs
- Landing: `/`
- Events: `/events`
- Projects: `/projects`
- Learn: `/learn`
- Admin: `/admin`
- Arena: `/arena`
- Squads: `/squads`
- Intake: `/intake`
- Profile: `/profile`
- Alumni: `/alumni`

### Route Count
~50+ routes across the platform

### File Count
~150+ source files
