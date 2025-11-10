import MainLayout from "@/layouts/MainLayout";
import EstimatedReadingTime from "@/components/EstimatedReadingTime";
import ReadingTime from "@/components/ReadingDuration";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";
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
    props: { number: Number(number) || 1, url: String(url) },
  };
}
function ArticlePage({ number, url }: ServerSideProps) {
  const router = useRouter();
  const [books, setBooks] = useState<BookProps[]>([]);
  const [book, setBook] = useState<BookProps | null>(null);

  // 监听路由查询参数变化，确保直接修改 URL 时能正确更新
  const queryChapter = router.query.number ? Number(router.query.number) : null;
  const currentChapter =
    queryChapter && !isNaN(queryChapter) ? queryChapter : number;

  const { currentPage, content, handleNextPage, handlePrevPage, isLoading } =
    usePagination(currentChapter, url);
  const { textSize } = useSettings();
  const [cleanedContent, setCleanContent] = useState<string>("");
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("bookInfo") : null;
    if (saved) {
      setBooks(JSON.parse(saved));
      setBook(JSON.parse(saved)[0]);
    }
  }, []);
  useEffect(() => {
    if (content) {
      setCleanContent(cleanHtmlContent(content));
    }
  }, [content]);

  // 只在客户端动态导入并清理 HTML
  useEffect(() => {
    if (typeof window !== "undefined" && cleanedContent) {
      import("isomorphic-dompurify").then((DOMPurify) => {
        setSanitizedContent(DOMPurify.default.sanitize(cleanedContent));
      });
    } else {
      setSanitizedContent(cleanedContent);
    }
  }, [cleanedContent]);

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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (books.length > 0) {
      books[0].currentChapter = currentPage.toString();
      if (typeof window !== "undefined") {
        localStorage.setItem("bookInfo", JSON.stringify(books));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // 依赖于 currentPage
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 mb-2">
        <EstimatedReadingTime wordCount={content.length} />
        <ReadingTime />
      </div>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "控制台", href: "/controlpanel" },
          { label: book?.title || "文章", isPage: true },
        ]}
      />
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
      <SwipeContainer
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="content dark:text-stone-300 min-h-[calc(100vh-100px)] flex flex-col"
        style={{ touchAction: "pan-y" }}
      >
        <ScrollProgress />
        {isLoading ? (
          <Loading />
        ) : (
          <div
            className="grow"
            style={{ fontSize: `${textSize}px` }}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}
      </SwipeContainer>
    </MainLayout>
  );
}
export default ArticlePage;
