export function removeWhitespaceAndNewlines(text: string): string {
  // 判断text是有效字符
  return text.replace ? text.replace(/\s+/g, "") : text; // 去除所有空格和换行符
}
export function stripHtmlTags(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || ""; // 提取文本内容
}
