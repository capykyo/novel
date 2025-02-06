// utils/paginationCache.ts
import { useState, useEffect, useCallback } from "react";

function cleanHtmlContent(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const allElements = doc.body.querySelectorAll("*");

  allElements.forEach((element) => {
    element.removeAttribute("class");
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("item")) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

function scrollToTop() {
  window.scrollTo({ top: 0 });
}

export function usePagination(initialPage: number) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [content, setContent] = useState<string>("");
  const [cache, setCache] = useState<Map<number, string>>(new Map());

  // 使用useCallback记忆fetchArticle函数
  const fetchArticle = useCallback(
    async (page: number) => {
      if (cache.has(page)) {
        setContent(cache.get(page) || "");
        return;
      }

      try {
        const response = await fetch(`/api/fetchArticle?number=${page}`);
        const data = await response.json();

        if (response.ok && data.content) {
          const cleanedContent = cleanHtmlContent(data.content);
          setContent(cleanedContent);

          const updatedCache = new Map(cache);
          updatedCache.set(page, cleanedContent);
          setCache(updatedCache);
        } else {
          console.error("Error fetching article:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      }
    },
    [cache]
  );

  useEffect(() => {
    fetchArticle(currentPage);
  }, [currentPage, fetchArticle]);

  const handleNextPage = () => {
    scrollToTop();
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    currentPage,
    content,
    handleNextPage,
    handlePrevPage,
  };
}
