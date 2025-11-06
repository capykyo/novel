import { storage } from "@/utils/storage";

// 更新BookInfo第一本书的currentChapter
export const updateBookCurrentChapter = (currentChapter: number) => {
  const bookInfoObj = storage.get<any[]>("bookInfo", []);
  if (bookInfoObj && bookInfoObj.length > 0) {
    bookInfoObj[0].currentChapter = currentChapter;
    storage.set("bookInfo", bookInfoObj);
  }
};
