import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Direct API handlers that bypass TanStack Start's Seroval serialization
async function handleAuthRegister(request: Request): Promise<Response> {
  try {
    const { register } = await import("./lib/api/auth-direct");
    const body = await request.json();
    const result = await register(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Registration failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleAuthLogin(request: Request): Promise<Response> {
  try {
    const { login } = await import("./lib/api/auth-direct");
    const body = await request.json();
    const result = await login(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Login failed" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Generic Supabase REST API — replaces all createServerFn calls
async function handleSupabaseApi(request: Request, pathname: string): Promise<Response> {
  try {
    const { supabase, query } = await import("./lib/supabase");
    const method = request.method;
    const body = method !== "GET" ? await request.json().catch(() => ({})) : {};

    const parts = pathname.replace("/api/supabase/", "").split("/");
    const op = parts[0];
    const table = parts[1];
    const fn = parts[1];

    let result;

    switch (op) {
      case "query": {
        result = await query(table, body);
        break;
      }
      case "insert": {
        result = await supabase.from(table).insert(body);
        break;
      }
      case "update": {
        result = await supabase.from(table).update(body.data, body.filters || {});
        break;
      }
      case "delete": {
        result = await supabase.from(table).delete(body.filters || {});
        break;
      }
      case "rpc": {
        result = await supabase.rpc(fn, body.params || {});
        break;
      }
      // Dedicated analytics: runs 14+ parallel count queries
      case "analytics": {
        const now = new Date().toISOString();
        const [
          { count: totalMembers },
          { count: activeMembers },
          { count: approvedMembers },
          { count: totalEvents },
          { count: upcomingEvents },
          { count: totalProjects },
          { count: approvedProjects },
          { count: totalTracks },
          { count: totalModules },
          { count: totalBlogPosts },
          { count: publishedBlogPosts },
          { count: totalOpportunities },
          { count: openOpportunities },
          { count: totalPartners },
        ] = await Promise.all([
          query("users", { select: "id", count: "exact", head: true, filters: {} }),
          query("users", {
            select: "id",
            count: "exact",
            head: true,
            filters: { is_active: true },
          }),
          query("users", {
            select: "id",
            count: "exact",
            head: true,
            filters: { is_approved: true },
          }),
          query("events", { select: "id", count: "exact", head: true, filters: {} }),
          query("events", {
            select: "id",
            count: "exact",
            head: true,
            filters: { start_date: { __op: "gte", value: now } },
          }),
          query("projects", { select: "id", count: "exact", head: true, filters: {} }),
          query("projects", {
            select: "id",
            count: "exact",
            head: true,
            filters: { status: "APPROVED" },
          }),
          query("tracks", { select: "id", count: "exact", head: true, filters: {} }),
          query("modules", { select: "id", count: "exact", head: true, filters: {} }),
          query("blog_posts", { select: "id", count: "exact", head: true, filters: {} }),
          query("blog_posts", {
            select: "id",
            count: "exact",
            head: true,
            filters: { status: "PUBLISHED" },
          }),
          query("opportunities", { select: "id", count: "exact", head: true, filters: {} }),
          query("opportunities", {
            select: "id",
            count: "exact",
            head: true,
            filters: { status: "OPEN" },
          }),
          query("partners", {
            select: "id",
            count: "exact",
            head: true,
            filters: { is_active: true },
          }),
        ]);

        const { data: recentMembers } = await query("users", {
          select: "id, email, created_at, profiles(full_name, avatar_url)",
          order: { column: "created_at", ascending: false },
          limit: 5,
        });

        const { data: roleRows } = await query("users", { select: "role" });

        const roleMap = new Map<string, number>();
        if (roleRows) {
          for (const row of roleRows) {
            roleMap.set(row.role, (roleMap.get(row.role) || 0) + 1);
          }
        }
        const roleDistribution = Array.from(roleMap.entries()).map(([role, _count]) => ({
          role,
          _count,
        }));

        result = {
          totalMembers: totalMembers || 0,
          activeMembers: activeMembers || 0,
          approvedMembers: approvedMembers || 0,
          totalEvents: totalEvents || 0,
          upcomingEvents: upcomingEvents || 0,
          totalProjects: totalProjects || 0,
          approvedProjects: approvedProjects || 0,
          totalTracks: totalTracks || 0,
          totalModules: totalModules || 0,
          totalBlogPosts: totalBlogPosts || 0,
          publishedBlogPosts: publishedBlogPosts || 0,
          totalOpportunities: totalOpportunities || 0,
          openOpportunities: openOpportunities || 0,
          totalPartners: totalPartners || 0,
          recentMembers: recentMembers || [],
          roleDistribution,
        };
        break;
      }
      // Settings upsert
      case "settings": {
        const { supabase, query } = await import("./lib/supabase");
        const results = [];
        const settings = body.settings || [];
        for (const setting of settings) {
          const { data: existing } = await query("site_settings", {
            select: "id",
            filters: { key: setting.key },
            single: true,
          });
          if (existing) {
            const { data: updated } = await supabase
              .from("site_settings")
              .update({ value: setting.value }, { key: setting.key });
            results.push(updated?.[0] ?? null);
          } else {
            const { data: created } = await supabase
              .from("site_settings")
              .insert({ key: setting.key, value: setting.value });
            results.push(created?.[0] ?? null);
          }
        }
        result = results;
        break;
      }
      // Leaderboard adjust points
      case "adjust-points": {
        const { supabase, query } = await import("./lib/supabase");
        const { userId, eventPoints, learnPoints, buildPoints, communityPoints } = body;

        const { data: existingEntry } = await query("leaderboard_entries", {
          select: "*",
          filters: { user_id: userId },
          single: true,
        });

        let entry;
        if (existingEntry) {
          const updates: Record<string, unknown> = {};
          if (eventPoints !== undefined) updates.event_points = eventPoints;
          if (learnPoints !== undefined) updates.learn_points = learnPoints;
          if (buildPoints !== undefined) updates.build_points = buildPoints;
          if (communityPoints !== undefined) updates.community_points = communityPoints;

          const ep = eventPoints ?? existingEntry.event_points;
          const lp = learnPoints ?? existingEntry.learn_points;
          const bp = buildPoints ?? existingEntry.build_points;
          const cp = communityPoints ?? existingEntry.community_points;
          updates.total_points = ep + lp + bp + cp;

          const { data: updated } = await supabase
            .from("leaderboard_entries")
            .update(updates, { user_id: userId });
          entry = updated?.[0];
        } else {
          const { data: inserted } = await supabase.from("leaderboard_entries").insert({
            user_id: userId,
            event_points: eventPoints ?? 0,
            learn_points: learnPoints ?? 0,
            build_points: buildPoints ?? 0,
            community_points: communityPoints ?? 0,
            total_points:
              (eventPoints ?? 0) + (learnPoints ?? 0) + (buildPoints ?? 0) + (communityPoints ?? 0),
          });
          entry = inserted?.[0];
        }
        result = entry;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Unknown operation: " + op }), { status: 400 });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "API error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleAuthLogout(request: Request): Promise<Response> {
  try {
    const { deleteRefreshToken } = await import("./lib/auth");
    const body = await request.json();
    await deleteRefreshToken(body.refreshToken);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleProfileUpdate(request: Request): Promise<Response> {
  try {
    const { supabase, query } = await import("./lib/supabase");
    const { verifyAccessToken } = await import("./lib/auth");
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { skills: newSkills, ...profileData } = body;

    const profileUpdates: Record<string, any> = {};
    if (profileData.fullName !== undefined) profileUpdates.full_name = profileData.fullName;
    if (profileData.nickname !== undefined) profileUpdates.nickname = profileData.nickname || null;
    if (profileData.avatarUrl !== undefined)
      profileUpdates.avatar_url = profileData.avatarUrl || null;
    if (profileData.department !== undefined) profileUpdates.department = profileData.department;
    if (profileData.level !== undefined) profileUpdates.level = profileData.level;
    if (profileData.experienceLevel !== undefined)
      profileUpdates.experience_level = profileData.experienceLevel;
    if (profileData.funFact !== undefined) profileUpdates.fun_fact = profileData.funFact || null;
    if (profileData.bio !== undefined) profileUpdates.bio = profileData.bio || null;
    if (profileData.xLink !== undefined) profileUpdates.x_link = profileData.xLink || null;
    if (profileData.githubLink !== undefined)
      profileUpdates.github_link = profileData.githubLink || null;
    if (profileData.portfolioLink !== undefined)
      profileUpdates.portfolio_link = profileData.portfolioLink || null;
    profileUpdates.updated_at = new Date().toISOString();

    const { data: profile } = await query("profiles", {
      select: "id",
      filters: { user_id: payload.userId },
      single: true,
    });

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (Object.keys(profileUpdates).length > 1) {
      const { error } = await supabase.from("profiles").update(profileUpdates, { id: profile.id });
      if (error) throw new Error(error.message);
    }

    if (newSkills !== undefined) {
      await supabase.from("profile_skills").delete({ profile_id: profile.id });
      for (const skillName of newSkills) {
        const { data: existingSkill } = await query("skills", {
          select: "id",
          filters: { name: skillName },
          single: true,
        });
        let skillId = existingSkill?.id;
        if (!skillId) {
          const { data: newSkill } = await supabase
            .from("skills")
            .insert({ id: crypto.randomUUID(), name: skillName });
          skillId = newSkill?.[0]?.id;
        }
        if (skillId) {
          await supabase
            .from("profile_skills")
            .insert({ profile_id: profile.id, skill_id: skillId });
        }
      }
    }

    const { data: updatedProfile } = await query("profiles", {
      select: "*",
      filters: { user_id: payload.userId },
      single: true,
    });

    const { data: profileSkills } = await query("profile_skills", {
      select: "skills(name)",
      filters: { profile_id: profile.id },
    });
    const skills = profileSkills?.map((ps: any) => ps.skills?.name).filter(Boolean) || [];

    return new Response(
      JSON.stringify({
        user: {
          id: payload.userId,
          profile: {
            fullName: updatedProfile.full_name,
            nickname: updatedProfile.nickname || undefined,
            avatarUrl: updatedProfile.avatar_url || undefined,
            dateOfBirth: updatedProfile.date_of_birth || undefined,
            department: updatedProfile.department || "",
            level: updatedProfile.level || "L100",
            experienceLevel: updatedProfile.experience_level || undefined,
            funFact: updatedProfile.fun_fact || undefined,
            bio: updatedProfile.bio || undefined,
            xLink: updatedProfile.x_link || undefined,
            githubLink: updatedProfile.github_link || undefined,
            portfolioLink: updatedProfile.portfolio_link || undefined,
            skills,
          },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Profile update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleAvatarUpload(request: Request): Promise<Response> {
  try {
    const { verifyAccessToken } = await import("./lib/auth");
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Only JPEG, PNG, and WebP images are allowed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size must be under 5MB" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { uploadToCloudinary } = await import("./lib/upload");
    const result = await uploadToCloudinary(file, "bcf-avatars");

    return new Response(JSON.stringify({ url: result.url, publicId: result.publicId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleProfileFetch(request: Request): Promise<Response> {
  try {
    const { supabase, query } = await import("./lib/supabase");
    const { verifyAccessToken } = await import("./lib/auth");
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await query("profiles", {
      select: "*",
      filters: { user_id: payload.userId },
      single: true,
    });

    const { data: profileSkills } = await query("profile_skills", {
      select: "skills(name)",
      filters: { profile_id: profile?.id },
    });
    const skills = profileSkills?.map((ps: any) => ps.skills?.name).filter(Boolean) || [];

    const { data: userBadges } = await query("user_badges", {
      select: "badges(name, label, description, icon, color)",
      filters: { user_id: payload.userId },
    });
    const badges = userBadges?.map((ub: any) => ub.badges).filter(Boolean) || [];

    return new Response(
      JSON.stringify({
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
          : null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to fetch profile" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Intercept direct API routes before TanStack Start handles them
    if (url.pathname === "/api/auth/register" && request.method === "POST") {
      return handleAuthRegister(request);
    }
    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      return handleAuthLogin(request);
    }
    if (url.pathname === "/api/auth/logout" && request.method === "POST") {
      return handleAuthLogout(request);
    }
    if (url.pathname === "/api/auth/profile" && request.method === "POST") {
      return handleProfileUpdate(request);
    }
    if (url.pathname === "/api/auth/profile" && request.method === "GET") {
      return handleProfileFetch(request);
    }
    if (url.pathname === "/api/auth/avatar" && request.method === "POST") {
      return handleAvatarUpload(request);
    }
    if (url.pathname.startsWith("/api/supabase/")) {
      return handleSupabaseApi(request, url.pathname);
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
