import useSWR from "swr";
import { removeWhitespaceAndNewlines, stripHtmlTags } from "@/utils/textFormat";

export function useAIReading(
  isAIReading: boolean,
  content: string | undefined
) {
  // 定义 fetcher 函数
  const fetcher = async () => {
    if (!content) return "";

    const processedContent = stripHtmlTags(
      removeWhitespaceAndNewlines(content)
    );

    const response = await fetch(`/api/fetchAiContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: processedContent,
      }),
    });

    if (!response.ok) {
      throw new Error("网络响应不正常");
    }

    const result = await response.json();
    return result.content;
  };

  // 使用 SWR 获取数据
  const { data, error } = useSWR(
    isAIReading && content ? ["aiContent", content] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1小时内相同的请求只发送一次
      fallbackData: "", // 默认为空字符串
    }
  );

  return {
    data,
    error,
    isLoading: isAIReading && !data && !error,
  };
}
