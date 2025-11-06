import { storage } from "@/utils/storage";
import { BookProps } from "@/types/book";

// 更新BookInfo第一本书的currentChapter
export const updateBookCurrentChapter = (currentChapter: number) => {
  const bookInfoObj = storage.get<BookProps[]>("bookInfo", []);
  if (bookInfoObj && bookInfoObj.length > 0) {
    bookInfoObj[0].currentChapter = currentChapter.toString();
    storage.set("bookInfo", bookInfoObj);
  }
};
