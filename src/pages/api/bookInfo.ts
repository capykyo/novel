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
      timeout: config.request?.timeout || 10000,
    });

    // 使用解析器解析书籍信息
    const bookInfo = parser.parseBookInfo(response.data, url);

    res.status(200).json(bookInfo);
  } catch (error) {
    console.error("Detailed error information:", error);
    let errorMessage = "Failed to fetch or parse the book info.";
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
