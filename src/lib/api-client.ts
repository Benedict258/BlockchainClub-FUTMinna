// Client-side replacement for all createServerFn calls
// Uses generic /api/supabase/ REST endpoints in server.ts
// to bypass Seroval serialization issues

function getAuthHeaders(): Record<string, string> {
  try {
    const stored = localStorage.getItem("bcp-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.accessToken;
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch {}
  return {};
}

export async function apiQuery(table: string, opts: Record<string, any> = {}) {
  const res = await fetch(`/api/supabase/query/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(opts),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Query failed");
  return json; // { data, error, count }
}

export async function apiQueryAll(table: string, opts: Record<string, any> = {}) {
  const { data } = await apiQuery(table, opts);
  return data || [];
}

export async function apiQuerySingle(table: string, opts: Record<string, any> = {}) {
  const { data } = await apiQuery(table, { ...opts, single: true });
  return data || null;
}

export async function apiInsert(table: string, rows: any) {
  const res = await fetch(`/api/supabase/insert/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(rows),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Insert failed");
  return json; // { data, error }
}

export async function apiUpdate(table: string, data: any, filters: Record<string, any>) {
  const res = await fetch(`/api/supabase/update/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ data, filters }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Update failed");
  return json; // { data, error }
}

export async function apiDelete(table: string, filters: Record<string, any>) {
  const res = await fetch(`/api/supabase/delete/${table}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ filters }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Delete failed");
  return json; // { error }
}

export async function apiRpc(fn: string, params: Record<string, any> = {}) {
  const res = await fetch(`/api/supabase/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ params }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "RPC failed");
  return json; // { data, error }
}

export async function apiAnalytics() {
  const res = await fetch("/api/supabase/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: "{}",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Analytics failed");
  return json;
}

export async function apiGetSettings() {
  return apiQueryAll("site_settings");
}

export async function apiUpsertSettings(settings: { key: string; value: string }[]) {
  const res = await fetch("/api/supabase/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify({ settings }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Settings failed");
  return json;
}

export async function apiAdjustPoints(body: Record<string, any>) {
  const res = await fetch("/api/supabase/adjust-points", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || json.error || "Adjust points failed");
  return json;
}

export async function apiLogout(refreshToken: string) {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return res.json();
}
