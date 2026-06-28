import { query, from } from "./supabase";

export function getChallengeTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    "code-duel": "Code Duel",
    "open-challenge": "Open Challenge",
    "speed-sprint": "Speed Sprint",
    ctf: "CTF Challenge",
    "community-vote": "Community Vote",
  };
  return labels[type] || type;
}

export function getChallengeTypeColor(type: string): string {
  const colors: Record<string, string> = {
    "code-duel": "text-red-600 dark:text-red-400",
    "open-challenge": "text-blue-600 dark:text-blue-400",
    "speed-sprint": "text-amber-600 dark:text-amber-400",
    ctf: "text-emerald-600 dark:text-emerald-400",
    "community-vote": "text-purple-600 dark:text-purple-400",
  };
  return colors[type] || "text-gray-600 dark:text-gray-400";
}

export function getChallengeTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    "code-duel": "Swords",
    "open-challenge": "Flag",
    "speed-sprint": "Zap",
    ctf: "Crosshair",
    "community-vote": "Trophy",
  };
  return icons[type] || "Award";
}

export function calculateWagerPool(challenge: any): number {
  return challenge?.stake_points || challenge?.total_stake || 0;
}

export async function distributeWinnings(challengeId: string, winnerId: string): Promise<void> {
  const { data: participants } = await query("challenge_participants", {
    select: "stake_points",
    filters: { challenge_id: challengeId },
  });

  const totalStake = (participants || []).reduce(
    (sum: number, p: any) => sum + (p.stake_points || 0),
    0,
  );

  const winnings = Math.floor(totalStake * 0.9);

  const { data: existingEntry } = await query("leaderboard_entries", {
    select: "*",
    filters: { user_id: winnerId },
    single: true,
  });

  if (existingEntry) {
    const newCommunity = (existingEntry.community_points as number) + winnings;
    const newTotal = (existingEntry.total_points as number) + winnings;
    await from("leaderboard_entries").update(
      {
        community_points: newCommunity,
        total_points: newTotal,
        updated_at: new Date().toISOString(),
      },
      { user_id: winnerId },
    );
  } else {
    await from("leaderboard_entries").insert({
      user_id: winnerId,
      total_points: winnings,
      event_points: 0,
      learn_points: 0,
      build_points: 0,
      community_points: winnings,
    });
  }

  await from("challenge_results").insert({
    challenge_id: challengeId,
    winner_id: winnerId,
    winnings_awarded: winnings,
    awarded_at: new Date().toISOString(),
  });

  await from("challenges").update(
    { status: "completed", winner_id: winnerId, completed_at: new Date().toISOString() },
    { id: challengeId },
  );
}

export async function checkAndAwardChallengeBadges(userId: string): Promise<void> {
  const { data: existingBadges } = await query("user_badges", {
    select: "badge_id",
    filters: { user_id: userId },
  });
  const owned = new Set((existingBadges || []).map((b: any) => b.badge_id));

  const { count: duelWins } = await query("challenges", {
    select: "id",
    filters: { winner_id: userId, type: "code-duel", status: "completed" },
    count: "exact",
    head: true,
  });

  const { count: challengesCreated } = await query("challenges", {
    select: "id",
    filters: { creator_id: userId },
    count: "exact",
    head: true,
  });

  const { count: sprintWins } = await query("challenges", {
    select: "id",
    filters: { winner_id: userId, type: "speed-sprint", status: "completed" },
    count: "exact",
    head: true,
  });

  const { count: ctfFlags } = await query("challenges", {
    select: "id",
    filters: { winner_id: userId, type: "ctf", status: "completed" },
    count: "exact",
    head: true,
  });

  const { count: communityWins } = await query("challenges", {
    select: "id",
    filters: { winner_id: userId, type: "community-vote", status: "completed" },
    count: "exact",
    head: true,
  });

  const { data: earnings } = await query("challenge_results", {
    select: "winnings_awarded",
    filters: { winner_id: userId },
  });
  const totalWagerEarnings = (earnings || []).reduce(
    (sum: number, r: any) => sum + (r.winnings_awarded || 0),
    0,
  );

  const { data: allWins } = await query("challenges", {
    select: "type",
    filters: { winner_id: userId, status: "completed" },
  });
  const distinctCategories = new Set((allWins || []).map((w: any) => w.type));

  const badgesToGrant: string[] = [];

  if (!owned.has("duelist") && (duelWins || 0) >= 5) {
    badgesToGrant.push("duelist");
  }
  if (!owned.has("gladiator") && (duelWins || 0) >= 10) {
    badgesToGrant.push("gladiator");
  }
  if (!owned.has("challenger") && (challengesCreated || 0) >= 5) {
    badgesToGrant.push("challenger");
  }
  if (!owned.has("speed-demon") && (sprintWins || 0) >= 3) {
    badgesToGrant.push("speed-demon");
  }
  if (!owned.has("ctf-hunter") && (ctfFlags || 0) >= 10) {
    badgesToGrant.push("ctf-hunter");
  }
  if (!owned.has("crowd-favorite") && (communityWins || 0) >= 3) {
    badgesToGrant.push("crowd-favorite");
  }
  if (!owned.has("high-roller") && totalWagerEarnings >= 100) {
    badgesToGrant.push("high-roller");
  }
  if (!owned.has("versatile") && distinctCategories.size >= 3) {
    badgesToGrant.push("versatile");
  }

  for (const badgeId of badgesToGrant) {
    try {
      await from("user_badges").insert({
        user_id: userId,
        badge_id: badgeId,
        granted_at: new Date().toISOString(),
      });
    } catch {
      // duplicate key ignored
    }
  }
}
