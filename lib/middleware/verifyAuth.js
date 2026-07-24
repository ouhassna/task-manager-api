import jwt from "jsonwebtoken";
import { AppError } from "@/lib/utils/AppError";

export function verifyAuth(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Missing or invalid authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}