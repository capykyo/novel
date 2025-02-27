import React from "react";
import { estimateReadingTime, formatReadingTime } from "@/utils/dateFormat";

interface ReadingTimeProps {
  wordCount: number;
  className?: string;
  wordsPerMinute?: number;
}

const EstimatedReadingTime: React.FC<ReadingTimeProps> = ({
  wordCount,
  className = "",
  wordsPerMinute = 350,
}) => {
  const seconds = estimateReadingTime(wordCount, wordsPerMinute);
  const readingTime = formatReadingTime(seconds);

  return (
    <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <span className="flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        共计{wordCount}字，预计阅读时间：{readingTime}
      </span>
    </div>
  );
};

export default EstimatedReadingTime;
