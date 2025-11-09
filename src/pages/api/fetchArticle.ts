// pages/api/fetchArticle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getParser, getSupportedSites, validateBookUrl } from "@/configs";

type Data = {
  content?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url, number } = req.query;

  if (!number || typeof number !== "string" || !url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  // 验证URL格式
  if (!validateBookUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    // 获取对应的解析器
    const parser = getParser(url);
    if (!parser) {
      const supportedSites = getSupportedSites()
        .map((site) => site.domain)
        .join(", ");
      return res.status(400).json({
        error: `Unsupported website. Supported sites: ${supportedSites}`,
      });
    }

    const chapterNumber = parseInt(number, 10);
    if (isNaN(chapterNumber)) {
      return res.status(400).json({ error: "Invalid chapter number" });
    }

    // 构建文章URL
    const articleUrl = parser.buildArticleUrl(url, chapterNumber);

    // 发起请求
    const config = parser.getConfig();
    const response = await axios.get(articleUrl, {
      headers: config.request?.headers || {},
      timeout: config.request?.timeout || 10000,
    });

    // 使用解析器解析文章内容
    const content = parser.parseArticle(response.data, chapterNumber);

    if (!content) {
      throw new Error("Failed to parse article content");
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Detailed error information:", error);
    let errorMessage = "Failed to fetch or parse the article.";
    if (axios.isAxiosError(error)) {
      // 如果是Axios错误，尝试获取更多信息
      errorMessage += ` Status: ${error.response?.status}, Message: ${error.message}`;
    } else {
      // 对于其他类型的错误
      errorMessage += ` Message: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
    res.status(500).json({ error: errorMessage });
  }
}
