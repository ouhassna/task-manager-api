import { NextResponse } from "next/server";

export function success(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function failure(message, status = 400, details = null) {
  return NextResponse.json(
    { success: false, error: message, ...(details && { details }) },
    { status }
  );
}