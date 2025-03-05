"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookProps } from "@/types/book";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Book({ book }: { book: BookProps }) {
  // 处理继续阅读的逻辑，当开始继续阅读时，需要将该本书插入到localStorage bookInfo中的第一项，并删除该本书
  const handleContinueReading = () => {
    const bookInfo = localStorage.getItem("bookInfo");
    if (bookInfo) {
      const bookInfoArray = JSON.parse(bookInfo);
      const newArr = bookInfoArray.filter(
        (item: BookProps) => item.url !== book.url
      );
      newArr.unshift(book);
      localStorage.setItem("bookInfo", JSON.stringify(newArr));
    }
  };
  return (
    <div>
      <Card className="relative w-[350px] overflow-hidden">
        <CardHeader>
          <CardTitle>{book.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-x-2">
          <Image
            className="grow"
            src={book.img || "/default.png"}
            alt={book.title || "无题"}
            width={120}
            height={160}
            priority
          />
          <div className="flex flex-col gap-y-2 w-[170px]">
            <div className="grow">
              <p className="text-sm text-gray-600 max-h-[100px] overflow-hidden line-clamp-5 dark:text-gray-400">
                {book.description}
              </p>
              <p className="text-sm mt-2">
                最后一章节: {book.lastChapterNumber}
              </p>
            </div>
            <div className="flex justify-between w-full">
              <Button variant="outline" size="sm">
                <Link href={book.url!} target="_blank" rel="noreferrer">
                  书籍地址
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleContinueReading}
              >
                <Link
                  href={`/article?number=${book.currentChapter}&url=${book.url}`}
                  rel="noreferrer"
                >
                  继续阅读
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Book;
