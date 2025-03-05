import MainLayout from "@/layouts/MainLayout";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import ReadingTime from "@/components/ReadingDuration";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { BookProps } from "@/types/book";
import { useState, useEffect } from "react";
import { usePagination } from "@/utils/paginationCache";
import { cleanHtmlContent } from "@/utils/helper";
import { useSettings } from "@/contexts/SettingsContext";
import { useRouter } from "next/router";
import { Loading } from "@/components/comm";
import { SwipeContainer } from "@/components/article";
import Link from "next/link";
import { IconButton } from "@/components/comm";
interface ServerSideProps {
  number: number;
  url: string;
}

export async function getServerSideProps(context: { query: ServerSideProps }) {
  const { number, url } = context.query;
  return {
    props: { number, url },
  };
}
function ArticlePage({ number, url }: ServerSideProps) {
  const router = useRouter();
  const [books, setBooks] = useState<BookProps[]>([]);
  const [book, setBook] = useState<BookProps | null>(null);
  const { currentPage, content, handleNextPage, handlePrevPage, isLoading } =
    usePagination(number, url);
  const { textSize } = useSettings();
  const [cleanedContent, setCleanContent] = useState<string>("");

  useEffect(() => {
    const bookInfo = localStorage.getItem("bookInfo");
    if (bookInfo) {
      setBooks(JSON.parse(bookInfo));
      setBook(JSON.parse(bookInfo)[0]);
    }
  }, []);
  useEffect(() => {
    if (content) {
      setCleanContent(cleanHtmlContent(content));
    }
  }, [content]);

  const handleSwipeLeft = () => {
    // 更新 URL，但不重新加载页面
    router.push(
      {
        pathname: "/article",
        query: { number: Number(currentPage) + 1, url: url },
      },
      undefined,
      { shallow: true }
    );
    // 向左滑动，翻到下一页
    handleNextPage();
  };

  const handleSwipeRight = () => {
    // 更新 URL，但不重新加载页面
    router.push(
      {
        pathname: "/article",
        query: { number: Number(currentPage) - 1, url: url },
      },
      undefined,
      { shallow: true }
    );
    // 向右滑动，翻到上一页
    handlePrevPage();
  };
  useEffect(() => {
    // 当页码变化时滚动到顶部
    window.scrollTo({ top: 0, behavior: "instant" });
    if (books.length > 0) {
      // 更新第一本书的页码
      books[0].currentChapter = currentPage.toString();
      localStorage.setItem("bookInfo", JSON.stringify(books));
    }
  }, [currentPage]); // 依赖于 currentPage
  return (
    <MainLayout>
      <div className="flex justify-between items-center">
        <EstimatedReadingTime wordCount={content.length} />
        <ReadingTime />
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
      <SwipeContainer
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="content dark:text-stone-300 min-h-[calc(100vh-100px)] flex flex-col"
      >
        <ScrollProgress />
        <Link
          href={{
            pathname: "/aireading",
            query: {
              url: url,
              number: currentPage,
              originalWordCount: content.length,
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
            text="AI 阅读模式"
          />
        </Link>
        {isLoading ? (
          <Loading />
        ) : (
          <div
            className="grow"
            style={{ fontSize: `${textSize}px` }}
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        )}
      </SwipeContainer>
    </MainLayout>
  );
}
export default ArticlePage;
