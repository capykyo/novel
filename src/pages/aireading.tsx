// 测试页面
import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { formatTime } from "@/utils/dateFormat";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import ReadingTime from "@/components/ReadingDuration";
import TimeSaving from "@/components/TimeSaving";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";
import { BookProps } from "@/types/book";
import Link from "next/link";
import { IconButton } from "@/components/comm";
import { SwipeContainer } from "@/components/article";
import { useRouter } from "next/router";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { updateBookCurrentChapter } from "@/utils/localStorageHelper";
import { storage } from "@/utils/storage";
interface ServerSideProps {
  number: number;
  url: string;
  originalWordCount: number;
}

export async function getServerSideProps(context: { query: ServerSideProps }) {
  const { number, url, originalWordCount } = context.query;

  // 验证必需参数
  if (!number || !url) {
    return {
      redirect: {
        destination: "/controlpanel",
        permanent: false,
      },
    };
  }

  return {
    props: {
      number: Number(number) || 1,
      url: String(url),
      originalWordCount: Number(originalWordCount) || 0,
    },
  };
}

export default function AiReadingPage({
  number,
  url,
  originalWordCount,
}: ServerSideProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [book, setBook] = useState<BookProps | null>({
    title: "未载入书籍",
    author: "未载入作者",
    description: "未载入描述",
    img: "https://via.placeholder.com/150",
    lastChapterNumber: "未载入章节",
    url: "未载入url",
    currentChapter: "未载入章节",
  });
  const router = useRouter();
  const [textLength, setTextLength] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(Number(number));

  const handleStreamResponse = (number: number, url: string) => {
    setIsLoading(true);
    setContent("");
    setError(null);

    // 从 localStorage 获取 API Key
    const apiKey = storage.get<string>("apiKey", "");

    // 创建 EventSource 实例，传递 API Key
    const eventSource = new EventSource(
      `/api/aiReader?number=${number}&url=${encodeURIComponent(url)}${apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : ""}`
    );

    eventSource.onopen = () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("EventSource连接建立时间:", formatTime(Date.now()));
      }
    };

    // 接收开始时发送的textLength
    eventSource.addEventListener("start", (event) => {
      setTextLength(Number(event.data));
    });

    // 处理消息事件
    eventSource.onmessage = (event) => {
      const text = event.data;
      setContent((prev) => {
        const newContent = prev + text;
        setWordCount(newContent.length);
        return newContent;
      });
      // 保留注释，闭包陷阱，当 handleStreamResponse 函数执行并设置 eventSource.onmessage 回调时，这个回调函数捕获了当时的 content 值（初始为空字符串）。
      // console.log("content", content);
    };

    // 处理错误事件（来自服务端的 error 事件）
    eventSource.addEventListener("error", (event: Event) => {
      const messageEvent = event as MessageEvent;
      try {
        const errorData = JSON.parse(messageEvent.data);
        setError(errorData.error || "AI 处理失败，请稍后重试");
      } catch {
        // 如果不是 JSON 格式，可能是连接错误
        setError("AI 处理失败，请稍后重试");
      }
      eventSource.close();
      setIsLoading(false);
    });

    // 处理连接错误
    eventSource.onerror = () => {
      // onerror 会在连接失败时触发，此时可能还没有收到 error 事件
      // 如果已经有错误信息就不覆盖
      if (!error) {
        setError("连接失败，请检查网络或 API 配置");
      }
      eventSource.close();
      setIsLoading(false);
    };

    // 处理连接关闭
    eventSource.addEventListener("done", () => {
      eventSource.close();
      setIsLoading(false);
    });
    return eventSource;
  };

  const handleSwipeLeft = () => {
    // 更新 URL，但不重新加载页面
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    updateBookCurrentChapter(newPage);
    router.push(
      {
        pathname: "/aireading",
        query: {
          number: newPage,
          url: url,
          originalWordCount: textLength,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSwipeRight = () => {
    // 更新 URL，但不重新加载页面
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    updateBookCurrentChapter(newPage);
    router.push(
      {
        pathname: "/aireading",
        query: {
          number: newPage,
          url: url,
          originalWordCount: textLength,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const saved = storage.get<BookProps[]>("bookInfo", []);
    if (saved && saved.length > 0) {
      setBook(saved[0]);
    }
    const eventSource = handleStreamResponse(number, url);
    return () => {
      if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number, url]);

  useEffect(() => {
    const eventSource = handleStreamResponse(currentPage, url);
    return () => {
      if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <MainLayout>
      <div className="flex justify-between items-center">
        <EstimatedReadingTime wordCount={wordCount} />
        <ReadingTime />
      </div>

      <div className="mt-2 mb-4">
        <TimeSaving
          originalCount={originalWordCount}
          aiCount={wordCount}
          currentPage={currentPage}
        />
      </div>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "控制台", href: "/controlpanel" },
          { label: book?.title || "AI 阅读", isPage: true },
        ]}
      />

      <Link
        href={{
          pathname: "/article",
          query: {
            url: url,
            number: currentPage,
          },
        }}
      >
        <IconButton
          className="mb-2"
          icon={{
            name: "material-symbols:robot-2-outline",
            width: "16",
            height: "16",
          }}
          text="普通阅读模式"
        />
      </Link>
      <SwipeContainer
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      >
        <div className="mt-4 whitespace-pre-wrap border p-4 rounded min-h-[200px] relative">
          {error ? (
            <div className="text-red-500 dark:text-red-400">
              <p className="font-semibold mb-2">错误：{error}</p>
              <Link href="/settings">
                <Button
                  variant="link"
                  className="text-blue-500 hover:underline"
                >
                  前往设置页面配置 API Key
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <MarkdownRenderer content={content} />
              {isLoading && (
                <span className="inline-block ml-1 animate-blink">▋</span>
              )}
            </>
          )}
        </div>
      </SwipeContainer>
    </MainLayout>
  );
}
