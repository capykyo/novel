"use client";

import { BookProps } from "@/types/book";
import { BookItem } from "./BookItem";

interface BookListProps {
  books: BookProps[];
  onDelete?: (url: string) => void;
  showDelete?: boolean;
  selectedBooks?: Set<string>;
  onToggleSelect?: (url: string) => void;
}

export function BookList({
  books,
  onDelete,
  showDelete = false,
  selectedBooks = new Set(),
  onToggleSelect,
}: BookListProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      {books.map((book, index) => {
        if (index === 0) {
          return (
            <div key={`reading-${book.url}`} className="flex flex-col gap-y-4">
              <div>正在阅读：</div>
              <BookItem
                key={book.url}
                book={book}
                onDelete={onDelete}
                showDelete={showDelete}
                isSelected={selectedBooks.has(book.url || "")}
                onToggleSelect={onToggleSelect}
              />
              {books.length > 1 && <div>历史记录：</div>}
            </div>
          );
        }
        return (
          <BookItem
            key={book.url}
            book={book}
            onDelete={onDelete}
            showDelete={showDelete}
            isSelected={selectedBooks.has(book.url || "")}
            onToggleSelect={onToggleSelect}
          />
        );
      })}
    </div>
  );
}
