"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { BookProps } from "@/types/book";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { storage } from "@/utils/storage";
import { Trash2 } from "lucide-react";

interface BookItemProps {
  book: BookProps;
  onDelete?: (url: string) => void;
  showDelete?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (url: string) => void;
}

export function BookItem({
  book,
  onDelete,
  showDelete = false,
  isSelected = false,
  onToggleSelect,
}: BookItemProps) {
  // 处理继续阅读的逻辑，当开始继续阅读时，需要将该本书插入到localStorage bookInfo中的第一项，并删除该本书
  const handleContinueReading = () => {
    const bookInfoArray = storage.get<BookProps[]>("bookInfo", []);
    if (bookInfoArray) {
      const newArr = bookInfoArray.filter((item) => item.url !== book.url);
      newArr.unshift(book);
      storage.set("bookInfo", newArr);
    }
  };

  const handleDelete = () => {
    if (onDelete && book.url) {
      onDelete(book.url);
    }
  };

  return (
    <div>
      <Card
        className={`relative w-[350px] overflow-hidden ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {showDelete && onToggleSelect && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelect(book.url || "")}
                />
              )}
              <CardTitle>{book.title}</CardTitle>
            </div>
            {showDelete && !onToggleSelect && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
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
