// pages/api/fetchArticle.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { JSDOM } from "jsdom";

type Data = {
  title?: string;
  img?: string;
  description?: string;
  lastChapterNumber?: string;
  url?: string;
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

  try {
    // 使用Axios发起GET请求
    const response = await axios.get(`${url}/list.html`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.43.0", // 设置合适的User-Agent
      },
    });

    // 解析HTML文档并提取文章内容
    const dom = new JSDOM(response.data);
    const body = dom.window.document.body;

    const title = body.querySelector(".list2 h3 span");
    const img = body.querySelector(".list2 img") as HTMLImageElement;
    const description = body.querySelector(".description p");
    // 从章节列表获取最后一章的页数
    const lastChapter = body.querySelectorAll(
      ".list3 li:last-child a"
    )[1] as HTMLAnchorElement;
    const lastChapterUrl = lastChapter.toString();
    const chapterNumberMatch = lastChapterUrl.match(/(\d+)/);
    const lastChapterNumber = chapterNumberMatch ? chapterNumberMatch[0] : "";

    if (!title || !img || !description || !lastChapterNumber) {
      throw new Error(
        "Failed to find article content using the specified selector."
      );
    }

    // 返回文章内容
    res.status(200).json({
      title: title?.textContent || "",
      img: img?.src || "",
      description: description?.textContent || "",
      lastChapterNumber: lastChapterNumber || "",
      url: url || "",
    });
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
