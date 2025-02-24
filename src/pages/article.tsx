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

  const { textSize } = useSettings();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [book, setBook] = useState<BookProps | null>(null);

  // 处理翻页事件
  useEffect(() => {
    localStorage.setItem("articleNumber", currentPage.toString());
    const books: BookProps[] = JSON.parse(localStorage.getItem("bookInfo")!);
    if (books.length > 0) {
      const book = books[0];
      book.currentChapter = currentPage.toString();
      localStorage.setItem("bookInfo", JSON.stringify(books));
      setBook(book);
      router.push(`/article?initialArticleNumber=${currentPage}&url=${url}`);
    }
  }, [currentPage]);

  // 使用 cleanHtmlContent 处理 content
  const cleanedContent =
    typeof window !== "undefined" ? cleanHtmlContent(content) : content;

  // 处理触摸事件
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // 向左滑动，翻到下一页
      handleNextPage();
    } else if (distance < -50) {
      // 向右滑动，翻到上一页
      handlePrevPage();
    }
  };

  return (
    <MainLayout>
      <div
        className="content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ScrollProgress className="h-1" />
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Icon icon="eos-icons:bubble-loading" width="48" height="48" />
          </div>
        ) : (
          <div
            style={{ fontSize: `${textSize}px` }}
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
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

          <button onClick={debounce(handleNextPage, 300)}>
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
