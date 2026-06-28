# Blockchain Club FUTMinna — Learn Platform Master Plan

Version 2.0 | June 2026

---

## 0. What We're Building

A **cohort-based education pipeline** adapted from the Technical Education Pipeline PDF, applied across **6 learning tracks** on the BlockchainClub FUTMinna web platform.

The platform transforms curious students into production-ready Web3 professionals through an aggressive, hands-on Build-to-Learn curriculum spanning all major blockchain ecosystems and professional disciplines.

---

## 1. The 6 Tracks — Full Detail

### Track 1: Technical (Solidity, Move, Rust)

The original PDF track. Students learn to build, test, and deploy smart contracts.

**Phase 0 — Professional Culture**
- Git & GitHub workflow: fork, clone, branch, PR, merge
- Command line proficiency: navigation, scripts, env vars, error streams
- OpSec & wallet safety: private keys, seed phrases, .env files, testnet hygiene
- Build-in-Public DEVLOG habit: weekly markdown log (start Week 2)
- Engineering culture: meaningful commits, clear READMEs, systematic debugging

**Phase 1 — Engineering Foundation**
- SWE Basics: Git deep-dive, CLI, package management, testing & debugging
- Blockchain Architecture: cryptography layer, P2P network, mempool, state machine, consensus (PoW vs PoS)
- Ecosystem Mapping: EVM (Solidity), MoveVM (Sui/Aptos), SVM (Solana), Bitcoin Script
- Monolithic vs Modular architectures, L1 vs L2 scaling (Optimistic vs ZK-Rollups)
- Reading Unfamiliar Code: navigating repos, reading contracts, identifying red flags
- **Gate 1 exit:** PR merged + CLI quiz 70%+ + 3 DEVLOG entries

**Phase 2 — Smart Contract Core**
- Solidity & EVM (2 weeks): state variables, access control, gas optimization, Hardhat/Foundry, ERC-20 with governance
- Move — Sui & Aptos (2 weeks): object model, resource-oriented programming, Sui objects, NFT module
- Rust & Solana (2 weeks): ownership/borrowing, accounts/instructions, Anchor framework, counter program
- Full-Stack Integration (shared, runs alongside): RPC nodes, IPFS/Arweave, The Graph indexing, ethers.js/viem/Sui SDK
- **Gate 2 exit:** dApp deployed + 5 passing tests + PR merged

**Phase 3 — Specialisation (pick one)**
- **Track 3A: Security Auditor** — reentrancy, flash loans, fuzzing/invariant testing, Slither/Mythril, MEV mechanics, Immunefi bug bounties
- **Track 3B: Protocol Developer** — EVM internals (opcodes, storage slots), MoveVM/SVM internals, ZK proofs (Circom/Noir), MEV-Boost/Flashbots
- **Track 3C: Full-Stack dApp Developer** — Account Abstraction (ERC-4337), Paymasters, session keys, social recovery, custom Subgraphs, viem/wagmi/Biconomy
- **Gate 3 exit:** Capstone project + demo presentation

**Capstone** — 48hr internal hackathon. Teams of 2-3. Real localized problems (student voting portal, funding tracker, credential system). Working prototype on testnet.

---

### Track 2: Design

Web3 designers. Visual and UX skills for decentralized applications.

**Phase 0 — Professional Culture**
- Tool stack: Figma, Penpot, design file management, naming conventions
- Weekly design log ("DESIGNLOG")
- OpSec: never embed keys in screenshots, protect client assets

**Phase 1 — Foundations**
- UX principles for Web3: transaction flows, confirmation states, error recovery
- Wallet UX patterns: connect, sign, approve — what users actually see
- Blockchain mental models for designers: accounts, gas, blocks (no code)
- Color theory and accessibility for dark-mode dApps
- Design systems: components, tokens, variants
- Hands-on: redesign a bad Web3 onboarding flow

**Phase 2 — Core**
- dApp UI design: DEX interfaces, NFT marketplaces, DAO dashboards
- Wallet design: extension popups, mobile wallet screens
- Transaction visualization: making gas fees and confirmations human-readable
- NFT visual design: generative art basics, metadata standards, IPFS hosting
- Responsive design for dApps (mobile-first, wallet-aware layouts)
- Hands-on: full dApp design prototype in Figma (10+ screens)

**Phase 3 — Specialisation (pick one)**
- **Track 3A: NFT & Brand Design** — generative collections, DAO branding, metaverse assets
- **Track 3B: Protocol UX** — complex DeFi flows, cross-chain UX, bridge interfaces
- **Track 3C: Design Engineering** — HTML/CSS/React basics, component libraries, design-to-code

**Capstone** — Design sprint: full product design for a club project. Deliverables: Figma prototype + design system + presentation.

---

### Track 3: Marketing

Web3 marketers. Growth, community, and narrative in crypto.

**Phase 0 — Professional Culture**
- Tool stack: Dune, Nansen, Typefully, Hypefury, Notion
- Weekly growth log ("GROWTHLOG")
- OpSec: 2FA on all accounts, phishing awareness, admin key management

**Phase 1 — Foundations**
- Web3 marketing vs Web2: community ownership, token incentives, anonymity
- Blockchain marketing landscape: L1s, L2s, DeFi, NFTs, DAOs
- Narrative design: scarcity, novelty, controversy, identity
- Memetics 101: meme lifecycle, when to meme, how memes drive adoption
- Analytics fundamentals: on-chain (TVL, volume, users) vs off-chain (impressions, CTR, sentiment)
- Hands-on: analyze a successful Web3 launch campaign — write a teardown

**Phase 2 — Core**
- Token launch marketing: pre-launch, fair launch, airdrop strategies
- Airdrop design: eligibility, sybil resistance, claim UX, post-claim retention
- Community building via marketing: turning followers into contributors
- Content strategy: threads, spaces, AMAs, newsletters
- KOL/influencer strategy: authentic voices, deal negotiation, ROI measurement
- Hands-on: campaign sprint — pitch deck + content calendar + 5 sample posts

**Phase 3 — Specialisation (pick one)**
- **Track 3A: Growth Hacking** — viral loops, referral mechanics, quest platforms (Galxe, Layer3)
- **Track 3B: Institutional Marketing** — B2B Web3, developer relations, enterprise blockchain
- **Track 3C: DAO Marketing** — governance proposal marketing, treasury comms, voting campaigns

**Capstone** — Campaign sprint: full GTM plan for a club product. Deliverables: positioning doc, 30-day calendar, 10 sample pieces, analytics dashboard, 5-min pitch.

---

### Track 4: Community Management

The people layer. Running Web3 communities at scale.

**Phase 0 — Professional Culture**
- Tool stack: Discord (bots, roles, channels), Telegram, Guild.xyz (token-gating)
- Moderation philosophy: warn, mute, kick, ban consistency
- Weekly community log ("COMMLOG")
- OpSec: admin key management, scam detection patterns, personal boundaries

**Phase 1 — Foundations**
- Community architecture: open vs gated, broadcast vs discussion, sync vs async
- Member lifecycle: lurker → contributor → superfan → ambassador → mod
- Web3 community economics: token behavior, airdrop farmers vs genuine members
- Discord/Telegram deep dive: channel structure, role hierarchies, welcome flows
- Conflict resolution: FUD, scams, member disputes, cultural clashes
- Hands-on: design a community structure for a hypothetical DeFi protocol

**Phase 2 — Core**
- Ambassador programs: recruitment, training, incentive design, performance tracking
- DAO governance facilitation: proposal discussions, temperature checks, vote coordination
- Event production: AMAs, community calls, game nights, meme contests
- Bot operations: auto-mod, welcome bots, ticket systems, level-up systems
- Crisis management: exploit announcements, PR incidents — what to say and when
- Hands-on: run a simulated community event (plan, execute, post-mortem)

**Phase 3 — Specialisation (pick one)**
- **Track 4A: DAO Operations** — governance tooling (Snapshot, Tally), delegation, multi-sig treasury
- **Track 4B: Developer Community** — devrel basics, hackathon community building, technical support triage
- **Track 4C: Global Communities** — multi-language, multi-timezone, cultural adaptation, regional ambassadors

**Capstone** — Community sprint: complete playbook for the club. Deliverables: Discord/TG proposal, ambassador program design, 3-month event calendar, crisis comms template, moderation handbook.

---

### Track 5: Content Creation

Web3 writers, video makers, and explainers.

**Phase 0 — Professional Culture**
- Tool stack: Markdown, Git for writers, CMS (Hashnode, Mirror)
- Editorial workflow: draft → review → publish → promote
- Weekly content log ("CONTENTLOG")
- OpSec: never embed keys in screenshots, protect sources, attribution ethics

**Phase 1 — Foundations**
- Technical writing fundamentals: clarity, structure, audience awareness
- Web3 content formats: threads, long-form, documentation, whitepapers, video scripts
- Blockchain concepts for writers: explaining gas, consensus, wallets without jargon
- Research methods: reading whitepapers, auditing sources, verifying on-chain data
- SEO for crypto content: keyword intent, backlinks, Web3 niches
- Hands-on: write a 10-tweet thread explaining a complex Web3 concept to a beginner

**Phase 2 — Core**
- Long-form content: 2,000+ word deep dives, protocol explanations, case studies
- Documentation writing: API references, developer guides, SDK docs — structure and conventions
- Video scripting: storyboarding, visual metaphors for abstract concepts
- Mirror.xyz publishing: NFT-gated content, crowdfund essays, revenue splits
- Content repurposing: one piece → thread, newsletter, video, podcast, infographic
- Hands-on: publish a long-form piece on Mirror.xyz

**Phase 3 — Specialisation (pick one)**
- **Track 5A: Developer Documentation** — API docs, SDK guides, auto-generated docs (Docusaurus, GitBook)
- **Track 5B: Narrative & Journalism** — crypto investigative pieces, protocol deep dives, industry analysis
- **Track 5C: Multimedia Content** — YouTube explainers, TikTok crypto, podcast production, infographics

**Capstone** — Content sprint: 3 pieces across formats about the club. Deliverables: 1 long-form Mirror post, 1 video script + storyboard, 1 thread series (5+ tweets), content calendar.

---

### Track 6: Research

Analysts and deep thinkers. Understanding why protocols work.

**Phase 0 — Professional Culture**
- Tool stack: Dune Analytics, Nansen, Token Terminal, DefiLlama, Messari
- Research methodology: hypothesis → data → analysis → conclusion → peer review
- Weekly research log ("RESEARCHLOG")
- OpSec: protect unpublished findings, embargo awareness, confidential data handling

**Phase 1 — Foundations**
- Blockchain data literacy: reading block explorers, interpreting transaction traces
- Protocol analysis framework: what does it do, how does it work, who controls it, what can break
- Tokenomics fundamentals: supply mechanics, emission schedules, vesting, governance weight
- Research methods: quantitative (on-chain queries) vs qualitative (documentation, sentiment)
- Academic rigour for crypto: structuring arguments, citing sources, acknowledging limitations
- Hands-on: write a 1-page protocol analysis using the 4-question framework

**Phase 2 — Core**
- Deep protocol analysis: architecture review, economic model stress-testing, security assumptions
- Governance research: proposal analysis, voter behavior, delegation dynamics, governance attacks
- MEV research: sandwich attacks, arbitrage, liquidation bots, PBS, MEV supply chain
- ZK and privacy research: ZK-SNARKs vs ZK-STARKs, privacy protocols, regulatory implications
- Cross-chain and interoperability: bridge architectures, message passing, security models, bridge trilemma
- Hands-on: produce a research report on MEV in a specific ecosystem

**Phase 3 — Specialisation (pick one)**
- **Track 6A: Protocol Researcher** — deep protocol reviews, economic audits, risk assessment reports
- **Track 6B: Data Analyst** — SQL/Dune dashboards, on-chain metrics, trend analysis, predictive modeling
- **Track 6C: Governance Researcher** — DAO analysis, proposal design, voter behavior, governance optimization

**Capstone** — Research sprint: substantive report. Deliverables: 3,000+ word report, Dune dashboard (5+ queries), methodology section, findings presentation (10 slides), peer-reviewed.

---

## 2. What Exists vs. Needs Building

### Already Built

| Feature | Status |
|---------|--------|
| Learn listing page (`/learn`) | Done — ecosystem tabs, track cards |
| 5 category sub-pages (design, marketing, etc.) | Done — auth-gated |
| Learn admin (`/admin/learn`) | Done — track + module CRUD, publish toggles |
| Leaderboard + points system | Done |
| User profiles + DEVLOG potential | Done (profiles with bio/skills) |
| Auth + roles | Done |

### Needs Building — 11 Features

**HIGH PRIORITY (4)**

| # | Feature | Files | DB |
|---|---------|-------|----|
| 1 | **Track Detail Page** `/learn/$slug` — phase timeline, module accordion, progress bar | 1 new | - |
| 2 | **Module Content** — inline accordion on track page, Markdown rendering, "Mark Complete" button | embedded in #1 | - |
| 3 | **Intake Assessment** `/intake` — 10-question quiz + practical task, auto-score, lane placement | 1 new | 1 new table |
| 4 | **DEVLOG System** `/profile/devlog` + `/members/$id/devlog` — weekly entries, CRUD, public view | 2 new | 1 new table |

**MEDIUM PRIORITY (3)**

| # | Feature | Files | DB |
|---|---------|-------|----|
| 5 | **Gate Check Dashboard** `/admin/gate-checks` — master grid, review modal, approve/reject | 1 new | 1 new table |
| 6 | **Phase Progress Tracker** — visual pipeline per student on profile + track pages | 1 component | - |
| 7 | **GitHub PR Integration** — OAuth, PR tracking, auto-points, streak badge | 2 new | 1 new table |

**LOW PRIORITY (4)**

| # | Feature | Files | DB |
|---|---------|-------|----|
| 8 | **SBT Certification** — Sui contract, admin issuance, PDF generation, profile display | 1 admin + contract | 1 new table |
| 9 | **Hackathon Calendar** — admin adds competitions, student interest RSVP, team formation | modify existing | add columns |
| 10 | **Cohort Management** `/admin/cohorts` + `/$id` — create, assign, progress grid, export | 2 new | 1 new table |
| 11 | **Alumni Directory** `/alumni` — graduated members, roles, contact, filterable | 1 new | add columns |

---

## 3. Database Schema — All New Tables

```sql
-- Track registry (replaces current tracks table)
CREATE TABLE IF NOT EXISTS curriculum_tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  ecosystem text NOT NULL DEFAULT 'GENERAL',
  category text NOT NULL DEFAULT 'technical',
  phase_count integer DEFAULT 5,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Module columns added to existing modules table
ALTER TABLE modules ADD COLUMN IF NOT EXISTS phase integer DEFAULT 1;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS ecosystem text DEFAULT 'GENERAL';
ALTER TABLE modules ADD COLUMN IF NOT EXISTS category text DEFAULT 'technical';

-- Lane placement results
CREATE TABLE IF NOT EXISTS intake_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id) UNIQUE,
  sw_score integer DEFAULT 0,
  blockchain_score integer DEFAULT 0,
  practical_completed boolean DEFAULT false,
  practical_url text,
  assigned_lane text DEFAULT 'foundation',
  completed_at timestamptz DEFAULT now()
);

-- Weekly student logs
CREATE TABLE IF NOT EXISTS devlog_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  week_number integer NOT NULL,
  content text NOT NULL,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Progression gates
CREATE TABLE IF NOT EXISTS gate_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  track_id uuid REFERENCES curriculum_tracks(id),
  gate integer NOT NULL,
  status text DEFAULT 'pending',
  reviewed_by text REFERENCES users(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, track_id, gate)
);

-- Academic cohorts
CREATE TABLE IF NOT EXISTS cohorts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS cohort_id uuid REFERENCES cohorts(id);

-- On-chain SBT records
CREATE TABLE IF NOT EXISTS certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  tier integer NOT NULL,
  track text,
  sbt_tx_hash text,
  pdf_url text,
  issued_at timestamptz DEFAULT now(),
  issued_by text REFERENCES users(id)
);

-- Sui blockchain integration columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sui_address text;
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS sui_entry_object_id text;
```

---

## 4. New Routes — 9 Pages

| # | Route | File | Auth | Priority |
|---|-------|------|------|----------|
| 1 | `/learn/$slug` | `learn/$slug.tsx` | View: public, Complete: login | **High** |
| 2 | `/intake` | `intake.tsx` | Login required | **High** |
| 3 | `/profile/devlog` | `profile/devlog.tsx` | Login + ownership | **High** |
| 4 | `/members/$memberId/devlog` | `members/$memberId/devlog.tsx` | Public | **High** |
| 5 | `/admin/gate-checks` | `admin/gate-checks.tsx` | Admin only | Medium |
| 6 | `/admin/cohorts` | `admin/cohorts.tsx` | Admin only | Low |
| 7 | `/admin/cohorts/$id` | `admin/cohorts/$id.tsx` | Admin only | Low |
| 8 | `/admin/certifications` | `admin/certifications.tsx` | Admin only | Low |
| 9 | `/alumni` | `alumni.tsx` | Public | Low |

---

## 5. Decision Log — Alignment Answers

| # | Question | Decision |
|---|----------|----------|
| 1 | Content management | Admin-side editor for all tracks. Technical from PDF. Non-technical: AI-drafted for admin review |
| 2 | Active tracks first cohort | Build the full 6-track system now. Content populated over time |
| 3 | Intake assessment | Built-in web form (auto-scored) |
| 4 | Gate checks | Mixed — automated where possible (quiz, DEVLOG count, GitHub PR), manual where needed (code review, design critique) |
| 5 | DEVLOG visibility | Public by default (build-in-public culture). Per-entry publish toggle for sensitive weeks |
| 6 | Timeline | Build everything working first → then launch cohort |
| 7 | Cohorts | Manual admin assignment. Cohorts created per academic period |
| 8 | On-chain SBTs | Build now — Sui Move, non-transferable objects |
| 9 | MVP priority order | Tracks → Modules → Intake → DEVLOG → Gates → Cohorts → SBTs → Alumni |
| 10 | Non-technical content | Structure now (B), technical content from PDF (A), AI-draft non-technical for admin review (D) |

---

## 6. Blockchain Integration — Sui Move Contract

### Two-Layer Data Model

```
┌──────────────┐     ┌───────────────┐
│   Supabase   │     │  Sui Contract │
│  (off-chain) │     │  (on-chain)   │
│              │     │               │
│  Fast reads  │     │  Immutable    │
│  All app data│     │  Points + SBT │
└──────┬───────┘     └───────┬───────┘
       │                     │
       └─────────┬───────────┘
                 ▼
          server.ts (API)
          Writes to BOTH
```

**Supabase handles everything.** Sui handles **two specific things**: points ledger and SBT certificates.

### What Goes On-Chain vs Off-Chain

| Data | Supabase | Sui |
|------|----------|-----|
| User profiles | ✅ | ❌ |
| Module progress | ✅ | ❌ |
| DEVLOG entries | ✅ | ❌ |
| **Leaderboard points** | ✅ Fast read | ✅ **Immutable record** |
| **Certificates (SBT)** | ✅ PDF + metadata | ✅ **Non-transferable proof** |
| Gate checks, cohorts | ✅ | ❌ |

### Smart Contract (Sui Move)

```move
module blockchainclub::registry {
    // One per student — created on first point award
    struct LeaderboardEntry has key {
        id: UID, student: address,
        event_points: u64, learn_points: u64,
        build_points: u64, community_points: u64,
        total_points: u64, badge_count: u8
    }

    // Non-transferable certificate
    struct Certificate has key {
        id: UID, student: address,
        tier: u8, track: String,
        cohort_year: u16, portfolio_url: String
    }

    // Admin-only capability
    struct AdminCap has key { id: UID }

    // Audit event emitted on every award
    struct PointsAwarded has copy, drop {
        student: address, category: u8,
        amount: u64, timestamp: u64
    }

    // Functions:
    // register_entry(student) — creates LeaderboardEntry
    // award_points(entry, category, amount) — updates points + emits event
    // issue_certificate(student, tier, track, cohort, url) — mints SBT
}
```

### Platform Integration

- **server.ts** calls Sui RPC via `@mysten/sui` SDK
- Admin wallet private key stored in `.env`
- Students add Sui address to their profile during Phase 0
- Every `awardPoints()` call writes to Supabase + Sui (if student has wallet)
- Points visible on leaderboard from Supabase (fast). Sui is audit trail (immutable).

### Deployment

1. `sui move new contracts/club-registry`
2. Write contract → `sui move build` → `sui move test`
3. `sui client publish` → Sui Testnet
4. Store PackageID in `.env`
5. Deploy to Mainnet when cohort goes live

---

## 7. Sprint Execution Plan

### Sprint 1: Curriculum Foundation
**Goal:** Students can browse 6 tracks, view phases, read modules.

| Task | Files | DB |
|------|-------|----|
| Create `curriculum_tracks` table + ALTER modules | SQL | 1 table + 4 columns |
| Seed 6 tracks via admin (`/admin/learn`) | Admin UI | 6 track rows |
| Update `/learn` — phase bars on cards, link to `$slug` | `learn/index.tsx` | - |
| Create `/learn/$slug` — track detail with phase timeline | `learn/$slug.tsx` | - |
| Module accordion — inline content + Markdown | `$slug.tsx` | - |
| "Mark Complete" button → `user_module_progress` | `$slug.tsx` | - |

### Sprint 2: Intake + DEVLOG
**Goal:** Lane placement. Weekly logging.

| Task | Files | DB |
|------|-------|----|
| Create `intake_assessments` + `devlog_entries` tables | SQL | 2 tables |
| Build `/intake` — quiz + practical + auto-score | `intake.tsx` | - |
| Build `/profile/devlog` — CRUD, week grid, streak | `profile/devlog.tsx` | - |
| Build `/members/$id/devlog` — public view | `members/$memberId/devlog.tsx` | - |
| Auto-award +5 points per DEVLOG entry | auto-awards.ts | - |

### Sprint 3: Gates + Cohorts
**Goal:** Admin tracks progression. Cohort management.

| Task | Files | DB |
|------|-------|----|
| Create `gate_checks` + `cohorts` tables, add cohort_id to users | SQL | 2 tables + 1 column |
| Build `/admin/gate-checks` — master grid, review modal | `admin/gate-checks.tsx` | - |
| Build `/admin/cohorts` + `/$id` — list, create, dashboard | 2 files | - |
| Gate status display on profile + track pages | modify existing | - |

### Sprint 4: Blockchain + SBTs + Alumni
**Goal:** On-chain certification. Alumni directory.

| Task | Files | DB |
|------|-------|----|
| Create `certifications` table | SQL | 1 table |
| Write + deploy Sui Move contract | `contracts/sui/` | - |
| Build `/admin/certifications` — issue SBT, generate PDF | `admin/certifications.tsx` | - |
| Build `/alumni` — Tier 3 graduate directory | `alumni.tsx` | - |
| Wire SBT display on student profiles | modify profile | - |
| Add Sui RPC integration to server.ts | `lib/sui-client.ts` | - |

---

## 8. Files Inventory

### New Files (15)
```
src/routes/learn/$slug.tsx                  — Track detail page
src/routes/intake.tsx                       — Intake assessment
src/routes/profile/devlog.tsx               — My DEVLOG
src/routes/members/$memberId/devlog.tsx     — Public DEVLOG
src/routes/alumni.tsx                       — Alumni directory
src/routes/admin/cohorts.tsx                — Cohort list
src/routes/admin/cohorts/$id.tsx            — Cohort dashboard
src/routes/admin/gate-checks.tsx            — Gate review
src/routes/admin/certifications.tsx         — Certificate issuance
src/components/phase-bar.tsx                — Phase indicator
src/components/markdown-content.tsx         — Markdown renderer
src/lib/sui-client.ts                       — Sui blockchain client
contracts/sui/Move.toml                     — Sui package config
contracts/sui/sources/club_registry.move    — Sui Move contract
```

### Modified Files (7)
```
src/routes/learn/index.tsx                  — Phase bars + new links
src/routes/profile.tsx                      — DEVLOG tab + gate status
src/lib/api/learn.server.ts                 — New server functions
src/lib/auto-awards.ts                      — DEVLOG + Sui triggers
src/server.ts                               — Sui RPC endpoints
src/stores/auth-store.ts                    — Add sui_address to profile
.env                                        — SUI_ADMIN_PRIVATE_KEY, SUI_PACKAGE_ID
```

---

## 9. Content Template — All Tracks

Every module across all 6 tracks follows this structure:

```markdown
## [Module Title]

### Overview
One paragraph — what you'll learn and why it matters.

### Core Concepts
3-5 key ideas in this module.

### Deep Dive
Main content. Sections with headings, examples, and cross-references.

### Practical Exercise
A hands-on task. Must produce a deliverable.
- Technical: PR, deployed contract, test suite
- Design: Figma link, design system component
- Marketing: Campaign brief, content piece, analytics report
- Community: Channel structure, bot config, event plan
- Content: Published piece, video script, documentation page
- Research: Analysis note, Dune query, methodology section

### Check Your Understanding
2-3 questions or reflection prompts.

### Resources
Links to further reading, tools, templates.
```

---

## 10. Weekly Session Format — All Tracks

| Time | Segment | Description |
|------|---------|-------------|
| 0:00–0:15 | Concept | Visual, interactive delivery. One concept per session. No long slide decks. |
| 0:15–1:00 | Build | Hands-on broken code/problem. Students receive a repo or brief with a deliberate issue to fix. |
| 1:00–1:15 | Submit & Review | Students submit their work. One student randomly selected to walk through their solution. Group feedback. |

---

*Plan finalized June 2026. Ready for Sprint 1 execution.*
