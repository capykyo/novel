import { useEffect } from "react";
import { usePagination } from "@/utils/paginationCache";
import { Icon } from "@iconify-icon/react";
import { useSettings } from "@/contexts/SettingsContext";
import cookie from "js-cookie";
import { debounce, cleanHtmlContent } from "@/utils/helper";
import type { GetServerSideProps } from "next";
import MainLayout from "../layouts/MainLayout";

function getInitialArticleNumber(
  articleNumberFromServer?: string | null
): number {
  if (typeof window !== "undefined") {
    const savedNumber = localStorage.getItem("articleNumber");
    return savedNumber
      ? parseInt(savedNumber, 10)
      : parseInt(articleNumberFromServer || "649", 10);
  }
  // 如果在服务端，返回默认值
  return parseInt(articleNumberFromServer || "1", 10);
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 从 cookie 中获取 articleNumber
  const articleNumberFromCookie =
    context.req.cookies.articleNumber === undefined
      ? null
      : context.req.cookies.articleNumber;

  return {
    props: {
      articleNumberFromServer: articleNumberFromCookie,
    },
  };
};

function ArticlePage({
  articleNumberFromServer,
}: {
  articleNumberFromServer: string | null;
}) {
  const initialArticleNumber = getInitialArticleNumber(articleNumberFromServer);
  const { currentPage, content, handleNextPage, handlePrevPage, isLoading } =
    usePagination(initialArticleNumber); // 使用初始文章编号
  const { textSize } = useSettings();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("articleNumber", currentPage.toString());
      cookie.set("articleNumber", currentPage.toString());
    }
  }, [currentPage]);

  const debouncedHandlePrevPage = debounce(handlePrevPage, 300);
  const debouncedHandleNextPage = debounce(handleNextPage, 300);

  // 使用 cleanHtmlContent 处理 content
  const cleanedContent =
    typeof window !== "undefined" ? cleanHtmlContent(content) : content;

  return (
    <MainLayout>
      <div className="content">
        {isLoading ? (
          <div className="text-center text-3xl">Loading...</div>
        ) : (
          <div
            style={{ fontSize: `${textSize}px` }}
            dangerouslySetInnerHTML={{ __html: cleanedContent }}
          />
        )}

        <div className="mt-8">
          <button onClick={debouncedHandlePrevPage} disabled={currentPage <= 1}>
            <Icon
              icon="ic:baseline-keyboard-double-arrow-left"
              width="36"
              height="36"
            />
          </button>

          <button onClick={debouncedHandleNextPage}>
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
