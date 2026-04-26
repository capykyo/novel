import type { NextApiRequest } from "next";

export function resolveApiKey(
  clientApiKey: string | undefined
): { apiKey: string } | { error: string } {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (!clientApiKey) {
      return { error: "API Key 未配置，请在设置页面配置 API Key" };
    }
    return { apiKey: clientApiKey };
  }

  const apiKey = clientApiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      error:
        "API Key 未配置，请在设置页面配置 API Key 或在环境变量中设置 OPENAI_API_KEY",
    };
  }
  return { apiKey };
}

export function getClientApiKey(
  req: NextApiRequest,
  source: "query" | "body" = "query"
): string | undefined {
  const raw = source === "body" ? req.body?.apiKey : req.query.apiKey;
  return typeof raw === "string" ? raw : undefined;
}
