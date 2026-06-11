import { supabase, query } from "@/lib/supabase";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  generateVerificationToken,
} from "@/lib/auth";
import { randomUUID } from "crypto";

const levelMap: Record<string, string> = {
  "100": "L100",
  "200": "L200",
  "300": "L300",
  "400": "L400",
  "500": "L500",
  "600": "L600",
};

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  department: string;
  level: string;
  skills: string[];
  experienceLevel: string;
  funFact?: string;
  xLink?: string;
  githubLink?: string;
  portfolioLink?: string;
}) {
  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const { data: existingUser } = await query("users", {
    select: "id",
    filters: { email: data.email },
    single: true,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await hashPassword(data.password);

  const userId = randomUUID();
  const now = new Date().toISOString();
  const { error: userError } = await supabase.from("users").insert({
    id: userId,
    email: data.email,
    password_hash: passwordHash,
    role: "MEMBER",
    is_active: false,
    is_approved: false,
    created_at: now,
    updated_at: now,
  });

  if (userError) throw new Error(userError.message);

  const { data: insertedUser } = await query("users", {
    select: "*",
    filters: { id: userId },
    single: true,
  });

  const profileId = randomUUID();
  const { error: profileError } = await supabase.from("profiles").insert({
    id: profileId,
    user_id: userId,
    full_name: data.fullName,
    date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
    department: data.department,
    level: levelMap[data.level] || data.level,
    experience_level: data.experienceLevel,
    fun_fact: data.funFact || null,
    x_link: data.xLink || null,
    github_link: data.githubLink || null,
    portfolio_link: data.portfolioLink || null,
    created_at: now,
    updated_at: now,
  });

  if (profileError) throw new Error(profileError.message);

  if (data.skills && data.skills.length > 0) {
    for (const skillName of data.skills) {
      const { data: existingSkill } = await query("skills", {
        select: "id",
        filters: { name: skillName },
        single: true,
      });

      let skillId = existingSkill?.id;

      if (!skillId) {
        skillId = randomUUID();
        const { data: newSkill, error: skillErr } = await supabase
          .from("skills")
          .insert({ id: skillId, name: skillName });
        if (skillErr) console.error("Skill insert error:", skillErr);
      }

      if (skillId && profileId) {
        await supabase.from("profile_skills").insert({ profile_id: profileId, skill_id: skillId });
      }
    }
  }

  const { data: profile } = await query("profiles", {
    select: "*",
    filters: { user_id: userId },
    single: true,
  });

  const { data: profileSkills } = await query("profile_skills", {
    select: "skills(name)",
    filters: { profile_id: profile?.id },
  });

  const skills = profileSkills?.map((ps: any) => ps.skills?.name).filter(Boolean) || [];

  const accessToken = generateAccessToken(insertedUser.id, insertedUser.role);
  const refreshToken = generateRefreshToken(insertedUser.id);
  await storeRefreshToken(refreshToken, insertedUser.id);

  const verificationToken = generateVerificationToken(insertedUser.id);
  try {
    const { sendVerificationEmail } = await import("@/lib/email");
    await sendVerificationEmail(insertedUser.email, verificationToken);
  } catch {
    console.error("Failed to send verification email");
  }

  return {
    user: {
      id: insertedUser.id,
      email: insertedUser.email,
      role: insertedUser.role,
      profile: profile
        ? {
            fullName: profile.full_name,
            nickname: profile.nickname || undefined,
            avatarUrl: profile.avatar_url || undefined,
            department: profile.department || "",
            level: profile.level || "L100",
            experienceLevel: profile.experience_level || undefined,
            funFact: profile.fun_fact || undefined,
            bio: profile.bio || undefined,
            xLink: profile.x_link || undefined,
            githubLink: profile.github_link || undefined,
            portfolioLink: profile.portfolio_link || undefined,
            skills,
          }
        : undefined,
    },
    accessToken,
    refreshToken,
    message: "Verification email sent. Please check your inbox.",
  };
}

export async function login(data: { email: string; password: string }) {
  const { data: user, error } = await query("users", {
    select: "*",
    filters: { email: data.email },
    single: true,
  });

  if (error || !user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await comparePassword(data.password, user.password_hash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const { data: profile } = await query("profiles", {
    select: "*",
    filters: { user_id: user.id },
    single: true,
  });

  const { data: profileSkills } = await query("profile_skills", {
    select: "skills(name)",
    filters: { profile_id: profile?.id },
  });

  const skills = profileSkills?.map((ps: any) => ps.skills?.name).filter(Boolean) || [];

  const { data: userBadges } = await query("user_badges", {
    select: "badges(name, label, description, icon, color)",
    filters: { user_id: user.id },
  });
  const badges = userBadges?.map((ub: any) => ub.badges).filter(Boolean) || [];

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);
  await storeRefreshToken(refreshToken, user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: profile
        ? {
            fullName: profile.full_name,
            nickname: profile.nickname || undefined,
            avatarUrl: profile.avatar_url || undefined,
            dateOfBirth: profile.date_of_birth || undefined,
            department: profile.department || "",
            level: profile.level || "L100",
            experienceLevel: profile.experience_level || undefined,
            funFact: profile.fun_fact || undefined,
            bio: profile.bio || undefined,
            xLink: profile.x_link || undefined,
            githubLink: profile.github_link || undefined,
            portfolioLink: profile.portfolio_link || undefined,
            skills,
            badges,
          }
        : undefined,
    },
    accessToken,
    refreshToken,
  };
}
