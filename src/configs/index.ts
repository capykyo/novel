/**
 * 配置系统主入口
 * 提供解析器工厂和网站识别功能
 */
import { SiteConfig } from "./types";
import { BaseParser } from "./parsers/base";
import { QuanbenParser } from "./parsers/quanben";
import { quanbenConfig } from "./sites/quanben.config";

// 网站配置注册表
const siteConfigs: SiteConfig[] = [quanbenConfig];

// 解析器映射
const parserMap: Record<
  string,
  new (config: SiteConfig) => BaseParser
> = {
  quanben: QuanbenParser,
};

/**
 * 根据URL识别网站
 * @param url 书籍URL
 * @returns 匹配的网站配置，如果没有匹配则返回 null
 */
export function identifySite(url: string): SiteConfig | null {
  // 直接使用原始URL进行匹配，因为URL模式已经考虑了各种格式
  for (const config of siteConfigs) {
    if (config.urlPattern.test(url)) {
      return config;
    }
  }
  return null;
}

/**
 * 获取解析器实例
 * @param url 书籍URL
 * @returns 解析器实例，如果网站不支持则返回 null
 */
export function getParser(url: string): BaseParser | null {
  const config = identifySite(url);
  if (!config) {
    return null;
  }

  const ParserClass = parserMap[config.id];
  if (!ParserClass) {
    throw new Error(`No parser found for site: ${config.id}`);
  }

  return new ParserClass(config);
}

/**
 * 获取所有支持的网站列表
 * @returns 支持的网站信息数组
 */
export function getSupportedSites(): Array<{
  id: string;
  name: string;
  domain: string;
}> {
  return siteConfigs.map((config) => ({
    id: config.id,
    name: config.name,
    domain: config.domain,
  }));
}

// 导出工具函数
export { normalizeUrl, validateBookUrl } from "./utils";

// 导出类型
export type { SiteConfig, BookInfoConfig, ArticleConfig } from "./types";

