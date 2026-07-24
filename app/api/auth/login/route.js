import { loginUser } from "@/lib/services/authService";
import { loginSchema } from "@/lib/validation/authSchemas";
import { rateLimit } from "@/lib/utils/rateLimit";
import { success, failure } from "@/lib/utils/apiResponse";
import { AppError } from "@/lib/utils/AppError";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = rateLimit(`login:${ip}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (!allowed) {
    return failure("Too many login attempts. Try again later.", 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return failure("Invalid or missing JSON body", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return failure("Validation failed", 400, parsed.error.flatten().fieldErrors);
  }

  try {
    const result = await loginUser(parsed.data);
    return success(result, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return failure(error.message, error.status);
    }
    console.error(error);
    return failure("Something went wrong", 500);
  }
}