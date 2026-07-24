import { verifyAuth } from "@/lib/middleware/verifyAuth";
import { createTask } from "@/lib/services/taskService";
import { createTaskSchema } from "@/lib/validation/taskSchemas";
import { success, failure } from "@/lib/utils/apiResponse";
import { AppError } from "@/lib/utils/AppError";

export async function POST(request) {
  let userId;
  try {
    userId = verifyAuth(request);
  } catch (error) {
    if (error instanceof AppError) return failure(error.message, error.status);
    return failure("Authentication failed", 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return failure("Invalid or missing JSON body", 400);
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return failure("Validation failed", 400, parsed.error.flatten().fieldErrors);
  }

  try {
    const task = await createTask(userId, parsed.data);
    return success(task, 201);
  } catch (error) {
    console.error(error);
    return failure("Something went wrong", 500);
  }
}