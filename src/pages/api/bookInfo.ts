// pages/api/bookInfo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getParser, getSupportedSites, validateBookUrl } from "@/configs";
import { BookProps } from "@/types/book";

type Data = BookProps & {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid book url" });
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

    // 构建请求URL
    const listUrl = parser.buildBookListUrl(url);

    // 发起请求
    const config = parser.getConfig();
    const response = await axios.get(listUrl, {
      headers: config.request?.headers || {},
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

    // 使用解析器解析书籍信息
    const bookInfo = parser.parseBookInfo(response.data, url);

    res.status(200).json(bookInfo);
  } catch (error) {
    console.error("Detailed error information:", error);
    let errorMessage = "Failed to fetch or parse the book info.";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      // 如果是Axios错误，尝试获取更多信息
      const status = error.response?.status;
      if (status === 403) {
        errorMessage = "访问被拒绝，网站可能检测到自动化请求。请稍后重试。";
        statusCode = 403;
      } else if (status === 404) {
        errorMessage = "书籍不存在或链接无效。";
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
