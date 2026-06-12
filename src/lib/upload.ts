const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getPublicUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/avatars/${path}`;
}

export async function uploadToSupabase(
  file: File,
  folder: string
): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${supabaseUrl}/storage/v1/object/avatars/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Upload failed (${res.status})`);
  }

  return { url: getPublicUrl(path), path };
}

export async function deleteFromSupabase(path: string): Promise<void> {
  const res = await fetch(`${supabaseUrl}/storage/v1/object/avatars/${path}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || `Delete failed (${res.status})`);
  }
}
