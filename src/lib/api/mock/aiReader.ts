import type { NextApiRequest } from "next";
import { mockAiSummary, delay, isMockError } from "@/lib/api/mock/_data";
import { setSseHeaders, writeSseError, SseResponse } from "@/lib/api/sse";

const CHUNK_SIZE = 3;
const CHUNK_INTERVAL_MS = 50;

export default async function handler(req: NextApiRequest, res: SseResponse) {
  setSseHeaders(res);

  if (isMockError(req.query)) {
    return writeSseError(res, "[Mock] 模拟 SSE 错误");
  }

  res.write(`event: start\ndata: ${mockAiSummary.length}\n\n`);

  for (let i = 0; i < mockAiSummary.length; i += CHUNK_SIZE) {
    const chunk = mockAiSummary.slice(i, i + CHUNK_SIZE);
    res.write(`data: ${chunk}\n\n`);
    if (res.flush) res.flush();
    await delay(CHUNK_INTERVAL_MS);
  }

  res.write(`event: done\ndata: completed\n\n`);
  res.end();
}
