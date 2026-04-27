import type { NextApiRequest } from "next";
import Client from "@/lib/modelManager";
import { formatTime } from "@/utils/dateFormat";
import { removeWhitespaceAndNewlines } from "@/utils/textFormat";
import { JSDOM } from "jsdom";
import { resolveApiKey, getClientApiKey } from "@/lib/api/apiKey";
import { setSseHeaders, writeSseError, SseResponse } from "@/lib/api/sse";

function stripHtmlTags(html: string): string {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || "";
}

export default async function handler(req: NextApiRequest, res: SseResponse) {
  if (process.env.USE_MOCK_API === "true") {
    const { default: mock } = await import("@/lib/api/mock/aiReader");
    return mock(req, res);
  }

  const { number, url: urlParam } = req.query;
  const url =
    typeof urlParam === "string"
      ? urlParam
      : Array.isArray(urlParam)
      ? urlParam[0]
      : "";

  if (!url || !number) {
    setSseHeaders(res);
    return writeSseError(res, "缺少必需参数：url 或 number");
  }

  const resolved = resolveApiKey(getClientApiKey(req, "query"));
  if ("error" in resolved) {
    setSseHeaders(res);
    return writeSseError(res, resolved.error);
  }

  try {
    const host = req.headers.host || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const encodedUrl = encodeURIComponent(url);
    const chapterNumber =
      typeof number === "string"
        ? number
        : Array.isArray(number)
        ? number[0]
        : String(number);
    const fetchURL = `${protocol}://${host}/api/article-content?number=${chapterNumber}&url=${encodedUrl}`;

    const response = await fetch(fetchURL);

    if (!response.ok) {
      let errorMessage = "获取文章内容失败";
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {
        // 使用默认消息
      }
      setSseHeaders(res);
      return writeSseError(res, errorMessage);
    }

    const article = await response.json();

    if (!article?.content) {
      setSseHeaders(res);
      return writeSseError(res, article?.error || "文章内容为空");
    }

    const processedArticle = stripHtmlTags(
      removeWhitespaceAndNewlines(article.content)
    );

    setSseHeaders(res);

    const startTime = Date.now();
    if (process.env.NODE_ENV !== "production") {
      console.log("请求开始时间:", formatTime(startTime));
    }

    try {
      if (process.env.NODE_ENV !== "production") {
        console.log("开始调用 OpenAI API:", formatTime(Date.now()));
      }

      const client = new Client(resolved.apiKey);
      const stream = await client.streamChatCompletion()({
        model: "internlm/internlm2_5-7b-chat",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `
## 角色定位
你是一个专业的小说内容精简助手，擅长提取关键情节并简洁呈现。

## 任务描述
将用户提供的小说章节内容精简为简短摘要，突出核心情节发展。

## 输出要求
1. **字数控制**：严格控制在250-300字之间
2. **结构清晰**：按时间线组织内容，遵循"时间-地点-人物-事件"的逻辑
3. **重点突出**：
   - 主要人物的关键行动和决定
   - 情节转折点
   - 重要对话和冲突
4. **格式规范**：使用Markdown格式，可适当使用小标题、加粗等增强可读性
5. **语言风格**：简洁、流畅，保留原文核心信息，避免口语化表达

## 禁止内容
- 不要包含个人评论或分析
- 不要使用"本章讲述了..."等冗余表述
- 避免过度简化导致情节连贯性丧失

请直接输出精简内容，无需解释你的处理过程。
            `,
          },
          { role: "user", content: processedArticle || "请提供文章内容" },
        ],
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("OpenAI API 返回stream时间:", formatTime(Date.now()));
      }

      res.write(`event: start\ndata: ${processedArticle.length}\n\n`);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${content}\n\n`);
        if (res.flush) res.flush();
      }

      res.write(`event: done\ndata: completed\n\n`);
      res.end();

      if (process.env.NODE_ENV !== "production") {
        console.log("请求结束时间:", formatTime(Date.now()));
      }
    } catch (error: unknown) {
      console.error("AI Reader Error:", error);
      const err = error as { message?: string; status?: number };
      const errorMessage =
        err?.message?.includes("API key") ||
        err?.status === 401 ||
        err?.status === 403
          ? "API Key 无效或未配置，请在设置页面检查配置"
          : err?.message?.includes("rate limit")
          ? "API 调用频率过高，请稍后重试"
          : "AI 处理失败，请稍后重试";
      writeSseError(res, errorMessage);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
