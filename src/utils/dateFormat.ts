// 格式化日期，将输入的秒数转换为小时、分钟、秒：00:00:00
export const formatDate = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours}:${minutes}:${remainingSeconds}`;
};
