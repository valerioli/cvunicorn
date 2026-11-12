/** Key-value storage adapter.
 *
 *  Production: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *  (Vercel marketplace → Upstash, free tier is plenty) and data persists.
 *  Development / no env: falls back to in-memory storage so everything
 *  works locally with zero setup (data resets on server restart).
 */

type Json = unknown;

const memory = new Map<string, { value: string; expiresAt?: number }>();

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const hasRedis = Boolean(url && token);

async function redis(command: (string | number)[]): Promise<{ result: unknown }> {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Storage error: ${res.status}`);
  const payload = await res.json() as { result: unknown; error?: string };
  if (payload.error) throw new Error("Storage command failed");
  return payload;
}

export async function kvSet(
  key: string,
  value: Json,
  ttlSeconds?: number,
): Promise<void> {
  const serialized = JSON.stringify(value);
  if (hasRedis) {
    const cmd: (string | number)[] = ["SET", key, serialized];
    if (ttlSeconds) cmd.push("EX", ttlSeconds);
    await redis(cmd);
    return;
  }
  memory.set(key, {
    value: serialized,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
  });
}

export async function kvGet<T = Json>(key: string): Promise<T | null> {
  if (hasRedis) {
    const { result } = await redis(["GET", key]);
    if (result == null) return null;
    return JSON.parse(result as string) as T;
  }
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt && hit.expiresAt < Date.now()) {
    memory.delete(key);
    return null;
  }
  return JSON.parse(hit.value) as T;
}

export async function kvDelete(key: string): Promise<void> {
  if (hasRedis) {
    await redis(["DEL", key]);
    return;
  }
  memory.delete(key);
}

/** Short leases prevent duplicate model calls across server instances. */
export async function acquireLease(key: string, owner: string, seconds: number): Promise<boolean> {
  if (hasRedis) return (await redis(["SET", key, owner, "NX", "EX", seconds])).result === "OK";
  const hit = memory.get(key);
  if (hit && (!hit.expiresAt || hit.expiresAt > Date.now())) return false;
  memory.set(key, { value: owner, expiresAt: Date.now() + seconds * 1000 });
  return true;
}

export async function releaseLease(key: string, owner: string): Promise<void> {
  if (hasRedis) {
    await redis(["EVAL", "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", 1, key, owner]);
  } else if (memory.get(key)?.value === owner) memory.delete(key);
}

/** Binary storage for the dev-mode upload fallback. */
const memoryFiles = new Map<string, { data: Uint8Array; type: string; name: string }>();

export function memFilePut(id: string, data: Uint8Array, type: string, name: string) {
  memoryFiles.set(id, { data, type, name });
}
export function memFileGet(id: string) {
  return memoryFiles.get(id) ?? null;
}
