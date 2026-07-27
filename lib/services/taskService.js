import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/utils/AppError";

export async function createTask(userId, { title, description }) {
  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return task;
}

export async function getUserTasks(userId) {
    const tasks = await prisma.task.findMany({
        where: {userId},
        orderBy: { createdAt: "desc"},
    });
    return tasks;
}

export async function updateTask(userId, taskId, data) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.userId !== userId) {
    throw new AppError("You do not have permission to modify this task", 403);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  return updatedTask;
}

export async function deleteTask(userId, taskId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.userId !== userId) {
    throw new AppError("You do not have permission to delete this task", 403);
  }

  await prisma.task.delete({ where: { id: taskId } });

  return { id: taskId };
}