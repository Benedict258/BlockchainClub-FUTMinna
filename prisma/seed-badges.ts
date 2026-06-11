import { supabase } from "../src/lib/supabase";

console.log("Seeding badges...");

const BADGES = [
  {
    name: "Top Builder",
    label: "Top Builder",
    description: "Outstanding contributions to projects",
    icon: "Code",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Top Learner",
    label: "Top Learner",
    description: "Completed multiple learning tracks",
    icon: "BookOpen",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Most Active",
    label: "Most Active",
    description: "Most active community member",
    icon: "Zap",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "Event Champion",
    label: "Event Champion",
    description: "Participated in 5+ events",
    icon: "Calendar",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "First Commit",
    label: "First Commit",
    description: "Made their first project contribution",
    icon: "Star",
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    name: "Goal Setter",
    label: "Goal Setter",
    description: "Set and achieved learning goals",
    icon: "Target",
    color: "text-rose-600 dark:text-rose-400",
  },
  {
    name: "Team Player",
    label: "Team Player",
    description: "Collaborated on 3+ projects",
    icon: "Users",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Pioneer",
    label: "Pioneer",
    description: "One of the founding members",
    icon: "Award",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Streak Master",
    label: "Streak Master",
    description: "30-day learning streak",
    icon: "Flame",
    color: "text-red-600 dark:text-red-400",
  },
  {
    name: "Community Star",
    label: "Community Star",
    description: "Outstanding community engagement",
    icon: "Trophy",
    color: "text-violet-600 dark:text-violet-400",
  },
];

async function main() {
  let inserted = 0;

  for (const badge of BADGES) {
    const { data: existing } = await supabase.query("badges", {
      select: "id",
      filters: { name: badge.name },
      limit: 1,
    });

    if (existing && existing.length > 0) {
      console.log(`Badge already exists: ${badge.name}`);
      continue;
    }

    const { data, error } = await supabase.from("badges").insert(badge);

    if (error) {
      console.error(`Failed to insert badge ${badge.name}:`, error.message);
    } else {
      console.log(`Inserted badge: ${badge.name}`);
      inserted++;
    }
  }

  console.log(`Seeding completed. Inserted ${inserted} new badge(s).`);
}

main().catch((e) => {
  console.error("Badge seeding failed:", e);
  process.exit(1);
});
