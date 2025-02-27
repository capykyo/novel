import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { usePagination } from "@/utils/paginationCache";
import { Icon } from "@iconify-icon/react";
import { useSettings } from "@/contexts/SettingsContext";
import { debounce, cleanHtmlContent } from "@/utils/helper";
import MainLayout from "../layouts/MainLayout";
import { BookProps } from "@/types/book";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ReadingTime from "@/components/ReadingDuration";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import { removeWhitespaceAndNewlines, stripHtmlTags } from "@/utils/textFormat";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useAIReading } from "@/utils/useAIReading";
import TimeSaving from "@/components/TimeSaving";

interface ServerSideProps {
  initialArticleNumber: string;
  url: string;
}

export async function getServerSideProps(context: { query: ServerSideProps }) {
  const { initialArticleNumber, url } = context.query;

  return {
    props: {
      initialArticleNumber,
      url,
    },
  };
}

function ArticlePage({
  initialArticleNumber,
  url,
}: {
  initialArticleNumber: string;
  url: string;
}) {
  const router = useRouter();
  const {
    initialArticleNumber: initialArticleNumberFromRouter,
    url: urlFromRouter,
  } = router.query;

  const { currentPage, content, handleNextPage, handlePrevPage, isLoading } =
    usePagination(
      Number(initialArticleNumberFromRouter) || Number(initialArticleNumber),
      (urlFromRouter as string) || (url as string)
    );

  const { content: nextPageContent } = usePagination(
    currentPage + 1,
    (urlFromRouter as string) || (url as string)
  );

  const { textSize } = useSettings();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [book, setBook] = useState<BookProps | null>(null);
  const [useAIRead, setUseAIRead] = useState(false);

  const {
    data: aiContent,
    error,
    isLoading: aiLoading,
  } = useAIReading(useAIRead, content, nextPageContent);

  useEffect(() => {
    const currentBookUrl = url;
    const lastBookUrl = localStorage.getItem("lastBookUrl");

    if (currentBookUrl && currentBookUrl !== lastBookUrl) {
      localStorage.setItem("readChapters", "[]");
      localStorage.setItem("lastBookUrl", currentBookUrl);
    }
  }, [url]);

  useEffect(() => {
    localStorage.setItem("articleNumber", currentPage.toString());
    const books: BookProps[] = JSON.parse(localStorage.getItem("bookInfo")!);
    if (books.length > 0) {
      const book = books[0];
      book.currentChapter = currentPage.toString();
      localStorage.setItem("bookInfo", JSON.stringify(books));
      setBook(book);
      router.push(`/article?initialArticleNumber=${currentPage}&url=${url}`);

      if (useAIRead && aiContent) {
      }
    }
  }, [currentPage]);

  const cleanedContent =
    typeof window !== "undefined" ? cleanHtmlContent(content) : content;

  const originalWordCount =
    typeof window !== "undefined"
      ? stripHtmlTags(removeWhitespaceAndNewlines(cleanedContent))
      : cleanedContent;

  const aiWordCount = aiContent ? stripHtmlTags(aiContent) : "";

  const wordCount = useAIRead ? aiWordCount : originalWordCount;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 150) {
      handleNextPage();
    } else if (distance < -150) {
      handlePrevPage();
    }
  };

  const handleAIReading = () => {
    setUseAIRead((prev) => !prev);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center">
        <EstimatedReadingTime wordCount={wordCount.length} />
        <ReadingTime />
      </div>

      {useAIRead && aiContent && !aiLoading && (
        <div className="mt-2 mb-4">
          <TimeSaving
            originalCount={originalWordCount.length}
            aiCount={aiWordCount.length}
            currentPage={currentPage}
          />
        </div>
      )}

      <div
        className="content dark:text-stone-300 min-h-[calc(100vh-100px)] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ScrollProgress />
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
        <Button
          className="self-end mb-4"
          onClick={handleAIReading}
          variant="outline"
        >
          {useAIRead ? "关闭AI阅读" : "开启AI阅读"}
        </Button>
        {isLoading ? (
          <div className="grow flex justify-center items-center h-full">
            <Icon icon="eos-icons:bubble-loading" width="48" height="48" />
          </div>
        ) : (
          <>
            {useAIRead ? (
              aiLoading ? (
                <div className="grow flex justify-center items-center h-full">
                  <Icon
                    icon="eos-icons:bubble-loading"
                    width="48"
                    height="48"
                  />
                </div>
              ) : (
                <div className="grow">
                  <MarkdownRenderer content={aiContent || ""} />
                </div>
              )
            ) : (
              <div
                className="grow"
                style={{ fontSize: `${textSize}px` }}
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
              />
            )}
          </>
        )}

        <div className="mt-8">
          <button
            onClick={debounce(handlePrevPage, 300)}
            disabled={currentPage <= 1}
          >
            <Icon
              icon="ic:baseline-keyboard-double-arrow-left"
              width="36"
              height="36"
            />
          </button>

          <button
            onClick={debounce(handleNextPage, 300)}
            disabled={currentPage >= Number(book?.lastChapterNumber)}
          >
            <Icon
              icon="ic:baseline-keyboard-double-arrow-right"
              width="36"
              height="36"
            />
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ArticlePage;
