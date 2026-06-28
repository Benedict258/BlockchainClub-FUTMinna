import { query, from } from "./supabase";

const CATEGORY_NUM: Record<string, number> = {
  event: 0,
  learn: 1,
  build: 2,
  community: 3,
};

const BADGE_ONCHAIN_MAP: Record<string, { type: number; name: string; description: string }> = {
  pioneer: {
    type: 0,
    name: "Pioneer",
    description: "One of the founding members",
  },
  "top-builder": {
    type: 1,
    name: "Top Builder",
    description: "Outstanding contributions to projects",
  },
  "top-learner": {
    type: 2,
    name: "Top Learner",
    description: "Completed multiple learning tracks",
  },
  "most-active": {
    type: 3,
    name: "Most Active",
    description: "Most active community member",
  },
  "community-star": {
    type: 4,
    name: "Community Star",
    description: "Outstanding community engagement",
  },
  "event-champion": {
    type: 5,
    name: "Event Champion",
    description: "Participated in 5+ events",
  },
  "first-commit": {
    type: 6,
    name: "First Commit",
    description: "Made their first project contribution",
  },
  "team-player": {
    type: 7,
    name: "Team Player",
    description: "Collaborated on 3+ projects",
  },
  duelist: {
    type: 8,
    name: "Duelist",
    description: "Won 5 Code Duels",
  },
  gladiator: {
    type: 9,
    name: "Gladiator",
    description: "Won 10 Code Duels",
  },
  challenger: {
    type: 10,
    name: "Challenger",
    description: "Created 5 public challenges",
  },
  "speed-demon": {
    type: 11,
    name: "Speed Demon",
    description: "Won 3 Speed Sprints",
  },
  "ctf-hunter": {
    type: 12,
    name: "CTF Hunter",
    description: "Captured 10 flags in CTFs",
  },
  "crowd-favorite": {
    type: 13,
    name: "Crowd Favorite",
    description: "Won 3 community-voted challenges",
  },
  "high-roller": {
    type: 14,
    name: "High Roller",
    description: "Earned 100+ points from wagers",
  },
  versatile: {
    type: 15,
    name: "Versatile",
    description: "Won challenges in 3 different categories",
  },
};

const POINTS = {
  PROJECT_APPROVED: 10,
  EVENT_ATTENDED: 5,
  BLOG_PUBLISHED: 5,
  PROFILE_COMPLETED: 3,
} as const;

const BADGE_THRESHOLDS = {
  "top-builder": { field: "build_points" as const, threshold: 50 },
  "top-learner": { field: "learn_points" as const, threshold: 50 },
  "most-active": { field: "total_points" as const, threshold: 100 },
  "community-star": { field: "community_points" as const, threshold: 30 },
} as const;

export async function awardPoints(
  userId: string,
  category: "event" | "learn" | "build" | "community",
  points: number,
): Promise<void> {
  const { data: existing } = await query("leaderboard_entries", {
    select: "*",
    filters: { user_id: userId },
    single: true,
  });

  const field = `${category}_points`;

  if (existing) {
    const newCategory = (existing[field] as number) + points;
    const newTotal = (existing.total_points as number) + points;
    await from("leaderboard_entries").update(
      { [field]: newCategory, total_points: newTotal, updated_at: new Date().toISOString() },
      { user_id: userId },
    );
  } else {
    await from("leaderboard_entries").insert({
      user_id: userId,
      total_points: points,
      event_points: category === "event" ? points : 0,
      learn_points: category === "learn" ? points : 0,
      build_points: category === "build" ? points : 0,
      community_points: category === "community" ? points : 0,
    });
  }

  try {
    const categoryNum = CATEGORY_NUM[category];
    if (categoryNum !== undefined) {
      const { data: profile } = await query("profiles", {
        select: "sui_address",
        filters: { user_id: userId },
        single: true,
      });
      if (profile?.sui_address) {
        const { data: entry } = await query("leaderboard_entries", {
          select: "sui_entry_object_id",
          filters: { user_id: userId },
          single: true,
        });
        if (entry?.sui_entry_object_id) {
          const { awardPointsOnChain } = await import("./sui-client");
          await awardPointsOnChain(
            profile.sui_address,
            entry.sui_entry_object_id,
            categoryNum,
            points,
          );
        }
      }
    }
  } catch (err) {
    console.error("Sui point award failed:", err);
  }

  await checkAndAwardBadges(userId);
}

export async function checkAndAwardBadges(userId: string): Promise<void> {
  const { data: entry } = await query("leaderboard_entries", {
    select: "*",
    filters: { user_id: userId },
    single: true,
  });

  if (!entry) return;

  const { data: existingBadges } = await query("user_badges", {
    select: "badge_id",
    filters: { user_id: userId },
  });

  const owned = new Set((existingBadges || []).map((b: any) => b.badge_id));

  const badgesToGrant: string[] = [];

  for (const [badgeId, config] of Object.entries(BADGE_THRESHOLDS)) {
    if (!owned.has(badgeId)) {
      const value = entry[config.field] as number;
      if (value >= config.threshold) {
        badgesToGrant.push(badgeId);
      }
    }
  }

  const { count: projectCount } = await query("project_members", {
    select: "id",
    filters: { user_id: userId },
    count: "exact",
    head: true,
  });

  if (!owned.has("first-commit") && (projectCount || 0) >= 1) {
    badgesToGrant.push("first-commit");
  }

  if (!owned.has("team-player") && (projectCount || 0) >= 3) {
    badgesToGrant.push("team-player");
  }

  const { count: eventCount } = await query("event_rsvps", {
    select: "id",
    filters: { user_id: userId },
    count: "exact",
    head: true,
  });

  if (!owned.has("event-champion") && (eventCount || 0) >= 5) {
    badgesToGrant.push("event-champion");
  }

  const { count: totalMembers } = await query("users", {
    select: "id",
    count: "exact",
    head: true,
  });

  if (!owned.has("pioneer") && (totalMembers || 0) <= 10) {
    badgesToGrant.push("pioneer");
  }

  for (const badgeId of badgesToGrant) {
    try {
      await from("user_badges").insert({
        user_id: userId,
        badge_id: badgeId,
        granted_at: new Date().toISOString(),
      });

      const badgeInfo = BADGE_ONCHAIN_MAP[badgeId];
      if (badgeInfo) {
        try {
          const { data: profile } = await query("profiles", {
            select: "sui_address",
            filters: { user_id: userId },
            single: true,
          });
          if (profile?.sui_address) {
            const { mintBadgeOnChain } = await import("./sui-client");
            await mintBadgeOnChain(
              profile.sui_address,
              badgeInfo.type,
              badgeInfo.name,
              badgeInfo.description,
            );
          }
        } catch (err) {
          console.error("Sui badge mint failed:", err);
        }
      }
    } catch {
      // ignore duplicate badge errors
    }
  }
}

export async function awardProjectPoints(projectId: string): Promise<void> {
  const { data: members } = await query("project_members", {
    select: "user_id",
    filters: { project_id: projectId },
  });

  if (!members) return;

  for (const member of members) {
    await awardPoints(member.user_id as string, "build", POINTS.PROJECT_APPROVED);
  }
}

export async function awardEventPoints(eventId: string): Promise<void> {
  const { data: rsvps } = await query("event_rsvps", {
    select: "user_id",
    filters: { event_id: eventId, attended: true },
  });

  if (!rsvps) return;

  for (const rsvp of rsvps) {
    await awardPoints(rsvp.user_id as string, "event", POINTS.EVENT_ATTENDED);
  }
}

export async function awardChallengeWinPoints(userId: string, stakePoints: number): Promise<void> {
  const winnings = Math.floor(stakePoints * 0.9);
  if (winnings > 0) {
    await awardPoints(userId, "community", winnings);
  }
}

export async function awardChallengeParticipation(userId: string): Promise<void> {
  await awardPoints(userId, "community", 2);
}

export async function checkChallengeBadges(userId: string): Promise<void> {
  const { checkAndAwardChallengeBadges } = await import("./challenges");
  await checkAndAwardChallengeBadges(userId);
}
