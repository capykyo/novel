import type { NextApiRequest, NextApiResponse } from "next";
import { mockArticle, delay, getMockDelay, isMockError } from "@/lib/api/mock/_data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ms = getMockDelay(req.query);
  if (ms) await delay(ms);

  if (isMockError(req.query)) {
    return res.status(500).json({ error: "[Mock] 模拟服务器错误" });
  }

  res.status(200).json({ content: mockArticle });
}
