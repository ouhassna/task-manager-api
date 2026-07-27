import { prisma } from "@/lib/prisma";

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