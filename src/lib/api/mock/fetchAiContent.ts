import type { NextApiRequest, NextApiResponse } from "next";
import { mockAiSummary, delay, getMockDelay, isMockError } from "@/lib/api/mock/_data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const ms = getMockDelay(req.body ?? {});
  if (ms) await delay(ms);

  if (isMockError(req.body ?? {})) {
    return res.status(500).json({ error: "[Mock] 模拟服务器错误" });
  }

  res.status(200).json({ content: mockAiSummary });
}
