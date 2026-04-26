import { bookInfo } from "@/pages/api/test/res";
import { article } from "@/pages/api/test/res/article";

export const mockBookInfo = bookInfo.expectRes;
export const mockArticle = article;
export const mockAiSummary = `## 本章概要

**莉亚**在深夜的树林中施展治愈魔法，救下了受困的冒险者学徒**汤姆**。

汤姆讲述了远方城市与宝藏的传说，触动了莉亚离开村庄的念头。两人决定结伴同行，踏上前往**永恒之城**的旅途。

途中历经猛兽袭击、迷宫考验与沙漠跋涉，莉亚结识了剑客**杰克**和地精工程师**鲁伯特**，魔法实力随之大幅精进。

抵达永恒之城后，莉亚发现古老预言书卷，预言一位纯净心灵的魔法师将在黑暗降临时引导众人走向光明。

---

*（Mock 数据 · 离线开发模式）*`;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getMockDelay(query: Record<string, string | string[] | undefined>): number {
  const raw = query.delay;
  const ms = parseInt(typeof raw === "string" ? raw : "0", 10);
  return isNaN(ms) || ms < 0 ? 0 : Math.min(ms, 10000);
}

export function isMockError(query: Record<string, string | string[] | undefined>): boolean {
  return query.error === "1";
}
