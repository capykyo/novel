export function cleanHtmlContent(htmlString: string): string {
  // 创建一个新的DOMParser实例，并解析HTML字符串
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // 获取文档中的所有元素
  const allElements = doc.body.querySelectorAll("*");

  // 遍历每个元素，移除class属性和所有自定义属性
  allElements.forEach((element) => {
    element.removeAttribute("class");
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("item")) {
        element.removeAttribute(attr.name);
      }
    });
  });

  // 返回清理后的HTML内容
  return doc.body.innerHTML;
}

// 防抖函数
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timer: NodeJS.Timeout | null;
  return (...args: Args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
}

// 节流函数
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  limit: number
): (...args: Args) => void {
  let inThrottle: boolean = false;
  return (...args: Args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
