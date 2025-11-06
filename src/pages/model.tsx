import MainLayout from "@/layouts/MainLayout";
import { usePagination } from "@/utils/paginationCache";
import { useState, useEffect } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import { removeWhitespaceAndNewlines, stripHtmlTags } from "@/utils/textFormat";
import apiClient from "@/lib/apiClient";
export default function ModelPage() {
  const [response, setResponse] = useState<string>("");
  const { content, handleNextPage, handlePrevPage } = usePagination(
    1,
    "https://quanben.io/n/yishilingwutianxia/"
  );

  const fetchResponse = async (content: string) => {
    const cleanedContent = stripHtmlTags(removeWhitespaceAndNewlines(content));
    // console.log(cleanedContent);
    // 缩减了多少字符
    const originalLength = content.length;
    const cleanedLength = cleanedContent.length;
    const reducedLength = originalLength - cleanedLength;
    if (process.env.NODE_ENV !== "production") {
      console.log(`缩减了 ${reducedLength} 字符`);
    }
    const prompt = `[${cleanedContent}]`;
    const encodedPrompt = encodeURIComponent(prompt);

    try {
      const data = (await apiClient.post(`/fetchAiContent`, {
        prompt: encodedPrompt,
      })) as { content: string };
      if (process.env.NODE_ENV !== "production") {
        console.log(data.content);
      }
      setResponse(data.content);
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse("Error fetching data.");
    }
  };
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("content内容", content);
    }
    if (content) {
      fetchResponse(content);
    }
  }, [content]);

  return (
    <MainLayout>
      <div>
        <h1>Model</h1>
        <EstimatedReadingTime
          wordCount={content?.length || 0}
          className="mb-4"
        />
        <button onClick={handleNextPage}>下一页</button>
        <button onClick={handlePrevPage}>上一页</button>
        <MarkdownRenderer content={response} />
      </div>
    </MainLayout>
  );
}
