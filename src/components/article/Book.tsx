"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookProps } from "@/types/book";

function Book({ book }: { book: BookProps }) {
  // useEffect(() => {
  //   if (data) {
  //     const bookInfo = JSON.stringify(data);
  //     localStorage.setItem("bookInfo", bookInfo);
  //     cookie.set("bookInfo", bookInfo, { expires: 3650 });
  //     setBookInfo(data);
  //   }
  // }, [data, setBookInfo]);

  // if (error) return <div>加载失败</div>;

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
            <p className="text-sm text-gray-500 max-h-[100px] overflow-hidden line-clamp-5">
              {book.description}
            </p>
            <p className="text-sm">最后一章节: {book.lastChapterNumber}</p>
            <p className="text-sm text-blue-500 underline underline-offset-4 cursor-pointer">
              <a href={book.url} target="_blank" rel="noreferrer">
                书籍地址
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Book;
