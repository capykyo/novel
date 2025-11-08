import { describe, it, expect } from "vitest";
import { cleanHtmlContent } from "@/utils/helper";

describe("cleanHtmlContent", () => {
  it("removes #ad and .list_page and class/item* attrs", () => {
    const html = `
      <div id="ad">ad</div>
      <div class="list_page">pager</div>
      <p class="c" itemprop="x">text</p>`;
    const res = cleanHtmlContent(html);
    expect(res).not.toContain("ad");
    expect(res).not.toContain("list_page");
    expect(res).not.toContain("class=");
    expect(res).not.toContain("itemprop");
  });
});


