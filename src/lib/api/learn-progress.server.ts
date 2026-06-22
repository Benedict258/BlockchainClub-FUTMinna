import { query, from } from "@/lib/supabase";
import { awardPoints } from "@/lib/auto-awards";

const DEFAULT_LEARN_POINTS = 5;

export async function getUserLearnProgress(userId: string) {
  const { data, error } = await query("user_module_progress", {
    select: "*",
    filters: { user_id: userId },
    order: { column: "completed_at", ascending: false },
  });

  if (error) return { data: null, error };
  return { data: data || [], error: null };
}

export async function completeModule(userId: string, moduleId: string, points?: number) {
  const { data: existing } = await query("user_module_progress", {
    select: "id",
    filters: { user_id: userId, module_id: moduleId },
    single: true,
  });

  if (existing) {
    return { data: existing, error: null, alreadyCompleted: true };
  }

  const pointsToAward = points ?? DEFAULT_LEARN_POINTS;

  const { data, error } = await from("user_module_progress").insert({
    user_id: userId,
    module_id: moduleId,
    completed_at: new Date().toISOString(),
    points_earned: pointsToAward,
  });

  if (error) return { data: null, error };

  await awardPoints(userId, "learn", pointsToAward);

  return { data: data?.[0] || null, error: null, alreadyCompleted: false };
}

export async function getUserCompletedModules(userId: string) {
  const { data, error } = await query("user_module_progress", {
    select: "module_id",
    filters: { user_id: userId },
  });

  if (error) return { data: null, error };
  return { data: (data || []).map((row: any) => row.module_id as string), error: null };
}
