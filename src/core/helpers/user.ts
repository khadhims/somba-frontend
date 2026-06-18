import ApiService from "@/core/services/ApiService";

export interface UserInfo {
  uid: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

const userCache = new Map<string, UserInfo>();

function extractUserData(response: unknown): UserInfo | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const payload = response as Record<string, unknown>;
  const data =
    payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : payload;

  if (!data.uid || typeof data.uid !== "string") {
    return null;
  }

  return {
    uid: data.uid,
    email: typeof data.email === "string" ? data.email : "",
    first_name: typeof data.first_name === "string" ? data.first_name : "",
    last_name: typeof data.last_name === "string" ? data.last_name : "",
  };
}

export function formatUserDisplayName(user?: UserInfo | null): string {
  if (!user) {
    return "";
  }

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return fullName || user.email || "";
}

export async function fetchUserByUid(uid: string): Promise<UserInfo | null> {
  if (!uid) {
    return null;
  }

  const cached = userCache.get(uid);
  if (cached) {
    return cached;
  }

  try {
    const resp = await ApiService.get("users", uid);
    const user = extractUserData(resp?.data);
    if (user) {
      userCache.set(uid, user);
    }
    return user;
  } catch {
    return null;
  }
}

export async function resolveUsersByUid(
  uids: string[]
): Promise<Map<string, UserInfo>> {
  const uniqueUids = [...new Set(uids.filter(Boolean))];
  const resolved = new Map<string, UserInfo>();

  await Promise.all(
    uniqueUids.map(async (uid) => {
      const user = await fetchUserByUid(uid);
      if (user) {
        resolved.set(uid, user);
      }
    })
  );

  return resolved;
}

export type CreatedByValue =
  | string
  | UserInfo
  | {
      uid?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      username?: string;
    }
  | null
  | undefined;

export function getCreatedByUid(value: CreatedByValue): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && typeof value.uid === "string") {
    return value.uid;
  }

  return null;
}

export function normalizeCreatedBy(
  value: CreatedByValue,
  userMap: Map<string, UserInfo>
): UserInfo | null {
  const uid = getCreatedByUid(value);
  if (uid) {
    return userMap.get(uid) ?? null;
  }

  if (value && typeof value === "object" && "email" in value) {
    return {
      uid: value.uid || "",
      email: value.email || "",
      first_name: value.first_name,
      last_name: value.last_name,
    };
  }

  return null;
}
