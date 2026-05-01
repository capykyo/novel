import React, { useEffect, useLayoutEffect, useState } from "react";
import { formatDate } from "@/utils/dateFormat";

const ReadingTimer: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useLayoutEffect(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {
    // 从 localStorage 恢复计时
    const savedTime =
      typeof window !== "undefined" && localStorage.getItem("readingTime");
    if (savedTime) {
      setTimeSpent(parseInt(savedTime, 10));
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent((prevTime) => {
          const newTime = prevTime + 1;
          if (typeof window !== "undefined") {
            localStorage.setItem("readingTime", newTime.toString());
          }
          return newTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <p className="whitespace-nowrap">
        阅读时间:{" "}
        <span className="font-mono tabular-nums min-w-[80px] inline-block">
          {formatDate(timeSpent)}
        </span>
      </p>
    </div>
  );
};

export default ReadingTimer;
