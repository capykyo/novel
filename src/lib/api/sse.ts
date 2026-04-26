import type { NextApiResponse } from "next";

export interface SseResponse extends NextApiResponse {
  flush?: () => void;
}

export function setSseHeaders(res: NextApiResponse): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
}

export function writeSseError(res: SseResponse, message: string): void {
  res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`);
  res.end();
}
