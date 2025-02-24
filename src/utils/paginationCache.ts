// utils/paginationCache.ts
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePagination(initialPage: number, url: string) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // 使用SWR来获取文章数据
  const { data, error } = useSWR(
    `/api/fetchArticle?number=${currentPage}&url=${url}`,
    fetcher
  );

  const isLoading = !data && !error; // 判断是否正在加载

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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
