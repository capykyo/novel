// 格式化日期，将输入的秒数转换为小时、分钟、秒：00:00:00
export const formatDate = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes}:${remainingSeconds}`;
};

/**
 * 格式化阅读时间
 * @param seconds 秒数
 * @returns 格式化后的阅读时间
 */
export const formatReadingTime = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}小时${minutes}分钟${remainingSeconds}秒`;
  }
};

/**
 * 估算阅读时间
 * @param wordCount 字数
 * @param wordsPerMinute 每分钟阅读字数 (默认 350 字/分钟)
 * @returns 预计阅读时间（秒）
 */
export function estimateReadingTime(
  wordCount: number,
  wordsPerMinute: number = 350
): number {
  // 将分钟转换为秒
  const readingTimeInSeconds = (wordCount / wordsPerMinute) * 60;
  // 四舍五入到最接近的秒数
  return Math.round(readingTimeInSeconds);
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
