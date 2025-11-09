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
    const defaultHeaders = config.request?.headers || {};
    
    // 添加 Referer 头，指向书籍列表页，使请求更像从网站内部跳转
    const headers = {
      ...defaultHeaders,
      Referer: parser.buildBookListUrl(url),
    };

    const response = await axios.get(articleUrl, {
      headers,
      timeout: config.request?.timeout || 15000,
      validateStatus: (status) => status < 500, // 允许 4xx 状态码，以便更好地处理错误
    });

    // 检查响应状态
    if (response.status === 403) {
      return res.status(403).json({
        error: "访问被拒绝，网站可能检测到自动化请求。请稍后重试。",
      });
    }

    if (response.status !== 200) {
      return res.status(response.status).json({
        error: `请求失败，状态码: ${response.status}`,
      });
    }

    // 使用解析器解析文章内容
    const content = parser.parseArticle(response.data, chapterNumber);

    if (!content) {
      throw new Error("Failed to parse article content");
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Detailed error information:", error);
    let errorMessage = "Failed to fetch or parse the article.";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      // 如果是Axios错误，尝试获取更多信息
      const status = error.response?.status;
      if (status === 403) {
        errorMessage = "访问被拒绝，网站可能检测到自动化请求。请稍后重试。";
        statusCode = 403;
      } else if (status === 404) {
        errorMessage = "章节不存在或已被删除。";
        statusCode = 404;
      } else {
        errorMessage += ` Status: ${status}, Message: ${error.message}`;
      }
    } else {
      // 对于其他类型的错误
      errorMessage += ` Message: ${
        error instanceof Error ? error.message : "Unknown error"
      }`;
    }
    res.status(statusCode).json({ error: errorMessage });
  }
}
