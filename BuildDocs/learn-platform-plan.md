# Blockchain Club FUTMinna — Learn Platform Implementation Plan

## 0. The PDF Summary (What We're Building)

The PDF defines a **cohort-based technical education pipeline** with 5 phases:
- **Intake** — lane placement assessment (Foundation / Fast)
- **Phase 0** — Professional culture, OpSec, weekly DEVLOG
- **Phase 1** — SWE basics, blockchain architecture, ecosystem mapping
- **Phase 2** — Smart contract development across EVM, Move, Solana
- **Phase 3** — Specialisation (Security | Protocol | Full-Stack)

Plus: certification (SBTs), hackathon pipeline, alumni/mentor layer, GitHub org, weekly sessions.

The PDF is **technical and development-focused**. The user wants this format adapted to **all 5 existing learn categories** (Design, Marketing, Community Management, Content Creation, Research).

---

## 1. Implementation Strategy — Phase-Based Rollout

### Phase 1: Structure & Content (Now)
**Goal:** The platform reflects the curriculum structure. Content is placeholder-ready.

| Deliverable | Detail |
|-------------|--------|
| Transform `/learn` landing into ecosystem-filtered curriculum browser | Tracks grouped by ecosystem (EVM, Sui, Solana, Aptos, General) |
| Each track gets: phases, modules within phases, gate check indicators |
| `/learn/[track-slug]` — dedicated track page with phase timeline, module list, progress |
| `/learn/[track-slug]/[module-slug]` — module content page (Markdown + code snippets) |
| Intake assessment page — lane placement quiz (multiple choice + practical task link) |
| DEVLOG system — per-user markdown log, linked to profile, leaderboard points |

### Phase 2: Content Population (After Structure)
| Category | Content needed |
|----------|---------------|
| **Technical (Solidity, Move, Rust)** | Adapt PDF content into modules |
| **Design** | UX for Web3, wallet design patterns, NFT visual design, DAO UI |
| **Marketing** | Web3 growth, community tokenomics, airdrop campaigns, memetics |
| **Community Management** | Discord/Telegram ops, moderation, ambassador programs, DAO governance |
| **Content Creation** | Technical writing, video explainers, Twitter threads, documentation |
| **Research** | Protocol analysis, tokenomics research, governance models, MEV research |

### Phase 3: Automation & Integration
- GitHub API integration for PR tracking
- Automated gate checks (quiz scoring, PR verification)
- On-chain SBT issuance (Sui or EVM)
- External hackathon calendar integration

---

## 2. What Exists vs. What Needs Building

### Already Built
| Feature | Status |
|---------|--------|
| Learn listing page (`/learn`) | Done — ecosystem tabs, track cards |
| 5 category sub-pages (design, marketing, etc.) | Done — auth-gated |
| Learn admin (`/admin/learn`) | Done — track + module CRUD, publish toggles |
| Leaderboard + points system | Done |
| User profiles + DEVLOG potential | Done (profiles with bio/skills) |
| Auth + roles | Done |

### Needs Building
| Feature | Priority |
|---------|----------|
| **Track detail page** (`/learn/[track-slug]`) — phase timeline, modules, progress | High |
| **Module detail page** (`/learn/[track-slug]/[module-slug]`) — content + code | High |
| **Intake assessment page** — quiz form + lane placement result | High |
| **DEVLOG system** — per-user markdown log, CRUD, public view | High |
| **Gate check dashboard** — admin reviews, student sees status | Medium |
| **Phase progress tracker** — visual pipeline for each student | Medium |
| **GitHub PR integration** — API polling for PR count/streak | Medium |
| **SBT certification** — on-chain issuance after gate checks | Low |
| **Hackathon calendar** — external competitions, team formation | Low |
| **Cohort management** — admin assigns students to cohorts | Low |
| **Alumni/mentor directory** — graduated members with roles | Low |

---

## 3. Database Schema — New Tables Needed

```sql
-- Learning curriculum structure
CREATE TABLE IF NOT EXISTS curriculum_tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  ecosystem text NOT NULL,
  category text NOT NULL, -- technical, design, marketing, etc.
  phase_count integer DEFAULT 5,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Modules belong to a track AND a phase
ALTER TABLE modules ADD COLUMN IF NOT EXISTS phase integer DEFAULT 1;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS ecosystem text;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS category text;

-- Gate checks
CREATE TABLE IF NOT EXISTS gate_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  track_id uuid REFERENCES curriculum_tracks(id),
  gate integer NOT NULL, -- 1, 2, 3
  status text DEFAULT 'pending', -- pending, passed, failed
  reviewed_by text REFERENCES users(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- DEVLOG entries
CREATE TABLE IF NOT EXISTS devlog_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  week_number integer NOT NULL,
  content text NOT NULL,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Intake assessments
CREATE TABLE IF NOT EXISTS intake_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id) UNIQUE,
  sw_score integer DEFAULT 0,
  blockchain_score integer DEFAULT 0,
  practical_completed boolean DEFAULT false,
  assigned_lane text DEFAULT 'foundation', -- foundation or fast
  completed_at timestamptz DEFAULT now()
);

-- Certifications (SBT tracking)
CREATE TABLE IF NOT EXISTS certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES users(id),
  tier integer NOT NULL, -- 1, 2, 3
  track text,
  sbt_tx_hash text,
  issued_at timestamptz DEFAULT now(),
  issued_by text REFERENCES users(id)
);
```

---

## 4. Page Architecture — New Routes

```
/learn                                    → Existing: curriculum browser (update to show phases)
/learn/[track-slug]                       → NEW: Track detail (phases, modules, gate checks, progress)
/learn/[track-slug]/[module-slug]         → NEW: Module content (Markdown, code, quiz)
/intake                                   → NEW: Lane placement assessment
/profile/devlog                           → NEW: User's DEVLOG (CRUD)
/members/$memberId/devlog                 → NEW: Public DEVLOG view
/admin/cohorts                            → NEW: Admin cohort management
/admin/gate-checks                        → NEW: Admin gate review
/admin/certifications                     → NEW: Admin SBT issuance
```

---

## 5. Adapting the PDF Format to Non-Technical Tracks

The PDF's structure applies universally. Here's how each element maps:

| PDF Element | Technical Track | Design Track | Marketing Track | Community Track | Content Track | Research Track |
|-------------|----------------|--------------|-----------------|-----------------|---------------|----------------|
| Phase 0: Culture | Git, OpSec, CLI | Design tool stack, file management | Campaign tooling, analytics setup | Platform ops, bot setup | CMS, publishing workflow | Research methodology, data tools |
| Phase 1: Foundations | SWE basics, blockchain arch | UX principles, wallet UX patterns | Web3 growth mechanics | Community economics, DAO governance | Technical writing fundamentals | Protocol analysis frameworks |
| Phase 2: Core | Smart contracts EVM/Move/Solana | dApp UI/UX design systems | Token launch strategies | Ambassador programs, moderation | Long-form content, video scripts | Tokenomics modeling |
| Phase 3: Specialisation | Security/Protocol/Full-Stack | NFT design, DAO branding | Growth hacking, airdrop design | DAO operations, conflict resolution | Developer docs, API documentation | MEV research, ZK research |
| Gate Checks | PR review, test suite, testnet deploy | Portfolio review, design critique | Campaign metrics review | Community health metrics | Published content review | Research paper draft |
| DEVLOG | Weekly code log | Weekly design log | Weekly campaign log | Weekly community log | Weekly content log | Weekly research log |
| Capstone | Hackathon build | Design sprint | Campaign sprint | Community sprint | Content sprint | Research paper |

---

## 6. Questions for Alignment

Before building, I need your input on these:

### Curriculum Content
1. **Who writes the actual content?** Do you have curriculum writers for each track, or should I create the structure with placeholder content that you fill later?

2. **Non-technical tracks** — the PDF is 100% technical. Do you have similar curriculum documents for Design, Marketing, Community, Content, and Research? Or should I just mirror the structure and let content come later?

### Intake & Gates
3. **Intake assessment** — should this be a web form built into the platform, or remain as Google Form? Web form means we can auto-calculate lane placement.

4. **Gate checks** — automated (pass quiz → auto-gate) or manual (admin reviews PRs/code and clicks approve)? The PDF suggests manual PR review.

### GitHub Integration
5. **GitHub API** — should we integrate now or later? It requires OAuth and adds significant complexity. The points system already exists; we could keep it manual for MVP.

### Cohorts & Timing
6. **When does the first cohort start?** This determines how fast we need to build.

7. **Cohort management** — admin manually assigns students to a cohort, or is it auto-assigned on registration?

### Certification
8. **On-chain SBTs** — which chain? Sui (non-transferable objects) or EVM (ERC-5192)? Build now or later?

### Scope
9. **MVP scope** — should we focus on Phase 0 + Phase 1 only (structure + content browsing), then build Phase 2-3 later? Or build the full pipeline now?

10. **Priority order** — which of these matters most right now?
    - a) Track/module content pages (students can browse and read)
    - b) Intake assessment (route new members)
    - c) DEVLOG system (students can log weekly)
    - d) Gate checks (admin can approve progression)
    - e) GitHub integration (automated PR tracking)
