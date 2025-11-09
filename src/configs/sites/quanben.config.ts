/**
 * quanben.io 网站配置
 */
import { SiteConfig } from "../types";

export const quanbenConfig: SiteConfig = {
  id: "quanben",
  name: "全本小说",
  domain: "quanben.io",
  urlPattern: /^https?:\/\/(www\.)?quanben\.io\/n\/[^/]+\/?$/,

  bookInfo: {
    listUrl: "{url}/list.html",
    selectors: {
      title: ".list2 h3 span",
      img: ".list2 img",
      description: ".description p",
      lastChapter: ".list3 li:last-child a",
      lastChapterNumber: {
        selector: ".list3 li:last-child a",
        extract: /(\d+)/,
        attribute: "href",
      },
    },
  },

  article: {
    urlTemplate: "{url}/{number}.html",
    selectors: {
      content: ".main",
    },
  },

  request: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
    timeout: 15000,
  },
};

