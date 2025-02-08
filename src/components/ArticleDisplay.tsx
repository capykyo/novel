import { useEffect } from "react";
import { usePagination } from "@/utils/paginationCache";
import { Icon } from "@iconify-icon/react";
import { useSettings } from "@/contexts/SettingsContext";
import cookie from "js-cookie";
import { debounce } from "@/utils/helper";

interface ArticleDisplayProps {
  initialArticleNumber: string | number;
}

function ArticleDisplay({ initialArticleNumber }: ArticleDisplayProps) {
  const { currentPage, content, handleNextPage, handlePrevPage } =
    usePagination(parseInt(initialArticleNumber as string));
  const { textSize } = useSettings();

  // 使用useEffect并在其中检查是否为客户端环境
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("articleNumber", currentPage.toString());
      cookie.set("articleNumber", currentPage.toString());
    }
  }, [currentPage]);

  const debouncedHandlePrevPage = debounce(handlePrevPage, 300);
  const debouncedHandleNextPage = debounce(handleNextPage, 300);

  return (
    <div className="content">
      <div
        style={{ fontSize: `${textSize}px` }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
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
  );
}

export default ArticleDisplay;
