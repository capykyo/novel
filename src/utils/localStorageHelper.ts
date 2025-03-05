// 更新BookInfo第一本书的currentChapter
export const updateBookCurrentChapter = (currentChapter: number) => {
  const bookInfo = localStorage.getItem("bookInfo");
  if (bookInfo) {
    const bookInfoObj = JSON.parse(bookInfo);
    bookInfoObj[0].currentChapter = currentChapter;
    localStorage.setItem("bookInfo", JSON.stringify(bookInfoObj));
  }
};
