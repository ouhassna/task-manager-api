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