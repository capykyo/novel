// utils/paginationCache.ts
import useSWR, { preload } from "swr";
import { useState, useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 预加载函数
const prefetchPage = (pageNumber: number, url: string) => {
  const prefetchUrl = `/api/fetchArticle?number=${pageNumber}&url=${url}`;
  preload(prefetchUrl, fetcher);
};

export function usePagination(initialPage: number, url: string) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // 使用SWR来获取文章数据
  const { data, error } = useSWR(
    `/api/fetchArticle?number=${currentPage}&url=${url}`,
    fetcher
  );

  const isLoading = !data && !error; // 判断是否正在加载

  // 当当前页面加载完成后，预加载下一页
  useEffect(() => {
    if (data && !isLoading) {
      // 预加载下一页
      prefetchPage(Number(currentPage) + 1, url);
    }
  }, [currentPage, data, isLoading, url]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Number(prev) + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => Number(prev) - 1);

      // 如果回到了第1页，也预加载一下上一页，避免用户反复切换时需要重新加载
      if (Number(currentPage) === 2) {
        prefetchPage(1, url);
      }
    }
  };

  return {
    currentPage,
    content: data?.content || "",
    handleNextPage,
    handlePrevPage,
    isLoading,
  };
}
