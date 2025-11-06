// pages/api/fetchAiContent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Client from "@/lib/modelManager";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type Data = {
  content?: string;
  error?: string;
};

const systemPrompt: ChatCompletionMessageParam = {
  role: "system",
  content: `# Role: 魔法阅读助手
# Profile:
- author: [Capykyo]
- version: 1.0
- language: 中文
- description: 你是一位擅长快速阅读和总结各类文章的专业助手，能够准确提炼出文章的核心情节、人物关系和精彩片段。
- output: 输出为markdown格式

## Goals:
- 快速理解文章中主要的情节和人物发展。
- 提供一个简洁但详细的概览，使读者能够把握文章的关键信息。
- 在不牺牲重要细节的前提下缩短阅读时间。

## Constraints:
- 遵循「2W1H阅读法」（What, Why, How）进行总结，但输出中不要直接提及该方法。
- 确保提供的摘要易于阅读，使用适当的排版如段落、列表、标题等。
- 每次输出应尽量保持结构和内容的一致性，避免大幅度变化。
- **输出格式必须遵循以下结构：**
- **章节概述：** [内容]
- **章节出现角色：** [角色1] - [描述1]， [角色2] - [描述2]，...
- **核心冲突：** [内容]
- **精彩片段：** [片段1]， [片段2]`,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // 检查请求方法
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  // 检查 API Key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({
      error: "API Key 未配置，请在设置页面配置 API Key",
    });
  }

  const client = Client.getInstance();

  try {
    const response = await client.createChatCompletion({
      model: "internlm/internlm2_5-7b-chat",
      messages: [systemPrompt, { role: "user", content: prompt }],
    });

    // 返回AI处理后的内容
    res.status(200).json({ content: response });
  } catch (error: any) {
    console.error("Error fetching AI content:", error);
    const errorMessage =
      error?.message?.includes("API key") ||
      error?.status === 401 ||
      error?.status === 403
        ? "API Key 无效或未配置，请在设置页面检查配置"
        : error?.message?.includes("rate limit")
        ? "API 调用频率过高，请稍后重试"
        : "AI 处理失败，请稍后重试";
    res.status(500).json({ error: errorMessage });
  }
}
