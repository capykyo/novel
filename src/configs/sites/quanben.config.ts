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
      "User-Agent": "PostmanRuntime/7.43.0",
    },
    timeout: 10000,
  },
};

