import { verifyAuth } from "@/lib/middleware/verifyAuth";
import { updateTask, deleteTask } from "@/lib/services/taskService";
import { updateTaskSchema } from "@/lib/validation/taskSchemas";
import { success, failure } from "@/lib/utils/apiResponse";
import { AppError } from "@/lib/utils/AppError";

export async function PUT(request, { params }) {
  let userId;
  try {
    userId = verifyAuth(request);
  } catch (error) {
    if (error instanceof AppError) return failure(error.message, error.status);
    return failure("Authentication failed", 401);
  }

  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return failure("Invalid or missing JSON body", 400);
  }

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return failure("Validation failed", 400, parsed.error.flatten().fieldErrors);
  }

  try {
    const task = await updateTask(userId, id, parsed.data);
    return success(task, 200);
  } catch (error) {
    if (error instanceof AppError) return failure(error.message, error.status);
    console.error(error);
    return failure("Something went wrong", 500);
  }
}

export async function DELETE(request, { params }) {
  let userId;
  try {
    userId = verifyAuth(request);
  } catch (error) {
    if (error instanceof AppError) return failure(error.message, error.status);
    return failure("Authentication failed", 401);
  }

  const { id } = await params;

  try {
    const result = await deleteTask(userId, id);
    return success(result, 200);
  } catch (error) {
    if (error instanceof AppError) return failure(error.message, error.status);
    console.error(error);
    return failure("Something went wrong", 500);
  }
}