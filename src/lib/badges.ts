import {
  Trophy,
  Code,
  BookOpen,
  Zap,
  Calendar,
  Star,
  Target,
  Users,
  Award,
  Flame,
} from "lucide-react";
import type { ComponentType } from "react";

export interface BadgeConfig {
  name: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export const BADGE_CONFIG: Record<string, BadgeConfig> = {
  "Top Builder": {
    name: "Top Builder",
    label: "Top Builder",
    description: "Outstanding contributions to projects",
    icon: Code,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  "Top Learner": {
    name: "Top Learner",
    label: "Top Learner",
    description: "Completed multiple learning tracks",
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  "Most Active": {
    name: "Most Active",
    label: "Most Active",
    description: "Most active community member",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  "Event Champion": {
    name: "Event Champion",
    label: "Event Champion",
    description: "Participated in 5+ events",
    icon: Calendar,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  "First Commit": {
    name: "First Commit",
    label: "First Commit",
    description: "Made their first project contribution",
    icon: Star,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  "Goal Setter": {
    name: "Goal Setter",
    label: "Goal Setter",
    description: "Set and achieved learning goals",
    icon: Target,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
  },
  "Team Player": {
    name: "Team Player",
    label: "Team Player",
    description: "Collaborated on 3+ projects",
    icon: Users,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  Pioneer: {
    name: "Pioneer",
    label: "Pioneer",
    description: "One of the founding members",
    icon: Award,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  "Streak Master": {
    name: "Streak Master",
    label: "Streak Master",
    description: "30-day learning streak",
    icon: Flame,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
  },
  "Community Star": {
    name: "Community Star",
    label: "Community Star",
    description: "Outstanding community engagement",
    icon: Trophy,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
  },
};

export function getBadgeConfig(name: string): BadgeConfig | undefined {
  return BADGE_CONFIG[name];
}

export function getAllBadges(): BadgeConfig[] {
  return Object.values(BADGE_CONFIG);
}
