// 测试api
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { formatTime } from "@/utils/dateFormat";
import { stripHtmlTags, removeWhitespaceAndNewlines } from "@/utils/textFormat";

interface CustomResponse extends NextApiResponse {
  flush?: () => void;
}

export default async function handler(
  req: NextApiRequest,
  res: CustomResponse
) {
  const { number, url } = req.query;
  try {
    // 在服务端发起请求，因为没有当前页这个概念，所以不能使用相对路径来发起请求
    const host = req.headers.host || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const fetchURL = `${protocol}://${host}/api/fetchArticle?number=${number}&url=${url}`;

    const response = await fetch(fetchURL);

    if (!response.ok) {
      console.error("Fetch error:", response.status, response.statusText);
      return res.status(response.status).json({ error: "Fetch failed" });
    }

    const article = await response.json();

    const processedArticle = stripHtmlTags(
      removeWhitespaceAndNewlines(article.content)
    );

    // GET 请求用于建立 EventSource 连接
    const openai = new OpenAI();
    // 设置 SSE 头部
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const startTime = Date.now();
    console.log("请求开始时间:", formatTime(startTime));

    try {
      console.log("开始调用 OpenAI API:", formatTime(Date.now()));
      const stream = await openai.beta.chat.completions.stream({
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
          { role: "user", content: processedArticle || "请提供文章内容" }, // 使用存储的文章内容
        ],
      });
      console.log("OpenAI API 返回stream时间:", formatTime(Date.now()));

      res.write(`event: start\ndata: ${processedArticle.length}\n\n`);
      // 发送数据流
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(`data: ${content}\n\n`);
        if (res.flush) {
          res.flush();
        }
      }

      // 发送完成事件
      res.write(`event: done\ndata: completed\n\n`);
      res.end();

      console.log("请求结束时间:", formatTime(Date.now()));
    } catch (error) {
      console.error("AI Reader Error:", error);
      res.write(
        `event: error\ndata: ${JSON.stringify({
          error: "Failed to read article",
        })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
