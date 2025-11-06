import { storage } from "@/utils/storage";
<<<<<<< HEAD
import { BookProps } from "@/types/book";

// 更新BookInfo第一本书的currentChapter
export const updateBookCurrentChapter = (currentChapter: number) => {
  const bookInfoObj = storage.get<BookProps[]>("bookInfo", []);
  if (bookInfoObj && bookInfoObj.length > 0) {
    bookInfoObj[0].currentChapter = currentChapter.toString();
=======

// 更新BookInfo第一本书的currentChapter
export const updateBookCurrentChapter = (currentChapter: number) => {
  const bookInfoObj = storage.get<any[]>("bookInfo", []);
  if (bookInfoObj && bookInfoObj.length > 0) {
    bookInfoObj[0].currentChapter = currentChapter;
>>>>>>> 186f60b (refactor: enhance localStorage handling and improve error management across components)
    storage.set("bookInfo", bookInfoObj);
  }
};
