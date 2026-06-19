import { query, from } from "./supabase";

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
    filters: { event_id: eventId },
  });

  if (!rsvps) return;

  for (const rsvp of rsvps) {
    await awardPoints(rsvp.user_id as string, "event", POINTS.EVENT_ATTENDED);
  }
}
