const attempts = new Map();

export function rateLimit(key, { maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.startTime > windowMs) {
    attempts.set(key, { count: 1, startTime: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterMs = windowMs - (now - record.startTime);
    return { allowed: false, retryAfterMs };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}