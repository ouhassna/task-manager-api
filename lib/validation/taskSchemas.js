import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().trim().max(1000, "Description is too long").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  completed: z.boolean().optional(),
});