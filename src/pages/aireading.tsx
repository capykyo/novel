// 测试页面
import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect } from "react";
import { formatTime } from "@/utils/dateFormat";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import ReadingTime from "@/components/ReadingDuration";
import TimeSaving from "@/components/TimeSaving";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookProps } from "@/types/book";
import Link from "next/link";
import { IconButton } from "@/components/comm";
import { SwipeContainer } from "@/components/article";
import { useRouter } from "next/router";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { updateBookCurrentChapter } from "@/utils/localStorageHelper";
interface ServerSideProps {
  number: number;
  url: string;
  originalWordCount: number;
}

export async function getServerSideProps(context: { query: ServerSideProps }) {
  const { number, url, originalWordCount } = context.query;
  return {
    props: {
      number,
      url,
      originalWordCount,
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

    // 创建 EventSource 实例
    const eventSource = new EventSource(
      `/api/aiReader?number=${number}&url=${url}`
    );

    eventSource.onopen = (event) => {
      console.log("EventSource连接建立时间:", formatTime(Date.now()));
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

    // 处理错误
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
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
    const bookInfo = localStorage.getItem("bookInfo");
    if (bookInfo) {
      setBook(JSON.parse(bookInfo)[0]);
    }
    const eventSource = handleStreamResponse(number, url);
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const eventSource = handleStreamResponse(currentPage, url);
    return () => {
      eventSource.close();
    };
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
      <Breadcrumb className="self-start mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/controlpanel">控制台</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{book?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
          <MarkdownRenderer content={content} />
          {isLoading && (
            <span className="inline-block ml-1 animate-blink">▋</span>
          )}
        </div>
      </SwipeContainer>
    </MainLayout>
  );
}
