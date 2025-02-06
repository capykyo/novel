// pages/api/fetchArticle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";

type Data = {
  content?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { number } = req.query;

  if (!number || typeof number !== "string") {
    return res.status(400).json({ error: "Invalid article number" });
  }

  try {
    // 使用Axios发起GET请求
    const response = await axios.get(
      `https://www.quanben.io/n/shishangdiyizushiye/${number}.html`,
      {
        headers: {
          "User-Agent": "PostmanRuntime/7.43.0", // 设置合适的User-Agent
        },
      }
    );

    // 解析HTML文档并提取文章内容
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // 注意：这里的选择器需要根据实际网页结构调整
    const articleContent = document.querySelector(".main")?.innerHTML || "";

    if (!articleContent) {
      throw new Error(
        "Failed to find article content using the specified selector."
      );
    }

    // 返回文章内容
    res.status(200).json({ content: articleContent });
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
