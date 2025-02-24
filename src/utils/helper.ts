export function cleanHtmlContent(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const body = doc.body;
  const allElements = doc.body.querySelectorAll("*");
  const adElement = body.querySelector("#ad");

  if (adElement) {
    adElement.remove();
  }

  const pageListElement = body.querySelector(".list_page");

  if (pageListElement) {
    pageListElement.remove();
  }

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
