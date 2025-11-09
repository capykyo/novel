/**
 * 配置系统工具函数
 */

/**
 * 规范化URL格式
 * 确保URL以 / 结尾（如果需要）
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // 移除末尾的斜杠（除了根路径）
    if (urlObj.pathname !== "/" && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    return urlObj.toString();
  } catch {
    // 如果不是有效URL，返回原字符串
    return url;
  }
}

/**
 * 验证书籍URL格式
 * 检查URL是否符合基本格式要求
 */
export function validateBookUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // 基本验证：必须是 http 或 https
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

