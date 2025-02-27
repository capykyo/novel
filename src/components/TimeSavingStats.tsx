import React, { useEffect, useState } from "react";
import { formatReadingTime } from "@/utils/dateFormat";

const TimeSavingStats: React.FC = () => {
  const [totalOriginalTime, setTotalOriginalTime] = useState(0);
  const [totalSavedTime, setTotalSavedTime] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    // 从 localStorage 获取时间统计数据
    const originalTime = parseInt(
      localStorage.getItem("totalOriginalTime") || "0"
    );
    const savedTime = parseInt(localStorage.getItem("totalSavedTime") || "0");

    setTotalOriginalTime(originalTime);
    setTotalSavedTime(savedTime);

    // 计算总体节省百分比
    if (originalTime > 0) {
      setTotalPercentage(Math.round((savedTime / originalTime) * 100));
    }

    // 监听 localStorage 变化
    const handleStorageChange = () => {
      const updatedOriginalTime = parseInt(
        localStorage.getItem("totalOriginalTime") || "0"
      );
      const updatedSavedTime = parseInt(
        localStorage.getItem("totalSavedTime") || "0"
      );

      setTotalOriginalTime(updatedOriginalTime);
      setTotalSavedTime(updatedSavedTime);

      if (updatedOriginalTime > 0) {
        setTotalPercentage(
          Math.round((updatedSavedTime / updatedOriginalTime) * 100)
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="text-sm">
      <div className="mb-1">
        <span className="font-semibold">总阅读时间:</span>{" "}
        {formatReadingTime(totalOriginalTime)}
      </div>
      <div className="mb-1">
        <span className="font-semibold">总节省时间:</span>{" "}
        {formatReadingTime(totalSavedTime)}
      </div>
      <div className="text-green-600 dark:text-green-400">
        <span className="font-semibold">总体效率提升:</span> {totalPercentage}%
      </div>
    </div>
  );
};

export default TimeSavingStats;
