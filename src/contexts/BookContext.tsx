import React, { createContext, useContext, useState, ReactNode } from "react";
import { BookProps } from "@/types/book";

interface BookContextType {
  bookInfo: BookProps | null;
  currentPage: number;
  setBookInfo: (info: BookProps | null) => void;
  setCurrentPage: (page: number) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookInfo, setBookInfo] = useState<BookProps | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <BookContext.Provider
      value={{ bookInfo, currentPage, setBookInfo, setCurrentPage }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBookContext must be used within a BookProvider");
  }
  return context;
};
