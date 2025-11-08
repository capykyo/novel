import React, { useEffect } from "react";
import { estimateReadingTime, formatReadingTime } from "@/utils/dateFormat";

interface TimeSavingProps {
  originalCount: number;
  aiCount: number;
  currentPage: number;
}

const TimeSaving: React.FC<TimeSavingProps> = ({
  originalCount,
  aiCount,
  currentPage,
}) => {
  // 计算原始内容的阅读时间（秒）
  const originalTime = estimateReadingTime(originalCount);

  // 计算AI内容的阅读时间（秒）
  const aiTime = estimateReadingTime(aiCount);

  // 计算节省的时间（秒）
  const savedTime = originalTime - aiTime;

  // 格式化时间：如果小于1分钟，显示秒数；否则显示分钟
  const formattedTime = formatReadingTime(savedTime);

  // 计算节省百分比
  const savedPercentage =
    originalCount > 0 ? Math.round((1 - aiCount / originalCount) * 100) : 0;

  useEffect(() => {
    // 获取已阅读章节记录
    const readChapters = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("readChapters")) ||
        "[]"
    );

    // 如果当前章节尚未被记录，则更新总时间统计
    if (!readChapters.includes(currentPage)) {
      // 获取现有的总时间统计
      const totalOriginalTime = parseInt(
        (typeof window !== "undefined" && localStorage.getItem("totalOriginalTime")) ||
          "0"
      );
      const totalSavedTime = parseInt(
        (typeof window !== "undefined" && localStorage.getItem("totalSavedTime")) ||
          "0"
      );

      // 更新总时间统计
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "totalOriginalTime",
          (totalOriginalTime + originalTime).toString()
        );
        localStorage.setItem(
          "totalSavedTime",
          (totalSavedTime + savedTime).toString()
        );
      }

      // 将当前章节添加到已阅读章节记录中
      readChapters.push(currentPage);
      if (typeof window !== "undefined") {
        localStorage.setItem("readChapters", JSON.stringify(readChapters));
      }
    }
  }, [currentPage, originalTime, savedTime]);

  return (
    <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
      <span className="mr-1">AI阅读节省:</span>
      <span className="font-bold">
        {formattedTime} ({savedPercentage}%)
      </span>
    </div>
  );
};

export default TimeSaving;
