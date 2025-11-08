"use client";

import MainLayout from "@/layouts/MainLayout";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";
import {
  BookForm,
  BookList,
  ClearBookshelf,
  ConfirmDialog,
} from "@/components/bookshelf";
import { useToast } from "@/hooks/use-toast";
import { useState, useLayoutEffect, useEffect, useReducer } from "react";
import { BookProps } from "@/types/book";
import { storage } from "@/utils/storage";
import { useBookContext } from "@/contexts/BookContext";

type ActionProps = {
  type: "init" | "update" | "delete" | "delete-multiple" | "clear";
  book?: BookProps;
  books?: BookProps[];
  url?: string;
  urls?: string[];
};

// 限制历史记录数量
const MAX_HISTORY_COUNT = 10;

function BookshelfPage() {
  const { toast } = useToast();
  useBookContext();
  const [bookUrl, setBookUrl] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [showDelete, setShowDelete] = useState(false);

  const reducerAction = (
    state: BookProps[],
    action: ActionProps
  ): BookProps[] => {
    switch (action.type) {
      case "init":
        return action.books || [];
      case "update":
        if (action.book) {
          // 如果当前书籍已经存在，则不添加
          if (state.some((book) => book.url === action.book?.url)) {
            return state;
          }
          // 如果state的长度大于MAX_HISTORY_COUNT，则删除最旧的书籍
          const newBooks =
            state.length >= MAX_HISTORY_COUNT
              ? [action.book, ...state.slice(0, MAX_HISTORY_COUNT - 1)]
              : [action.book, ...state];
          storage.set("bookInfo", newBooks);
          return newBooks;
        }
        return state;
      case "delete":
        if (action.url) {
          const newBooks = state.filter((book) => book.url !== action.url);
          storage.set("bookInfo", newBooks);
          return newBooks;
        }
        return state;
      case "delete-multiple":
        if (action.urls && action.urls.length > 0) {
          const newBooks = state.filter(
            (book) => !action.urls?.includes(book.url || "")
          );
          storage.set("bookInfo", newBooks);
          return newBooks;
        }
        return state;
      case "clear":
        storage.set("bookInfo", []);
        return [];
      default:
        return state;
    }
  };

  const [books, booksDispatch] = useReducer(reducerAction, []);

  // init
  useLayoutEffect(() => {
    const storedBooks = storage.get<BookProps[]>("bookInfo", []);
    if (storedBooks && storedBooks.length > 0) {
      booksDispatch({ type: "init", books: storedBooks });
    }
  }, []);

  // 当bookUrl更新时，获取书籍信息
  useEffect(() => {
    if (bookUrl) {
      if (process.env.NODE_ENV !== "production") {
        console.log("url被更新", bookUrl);
      }
      const fetchBookInfo = async () => {
        try {
          const res = await fetch(`/api/bookInfo?url=${bookUrl}`);
          if (!res.ok) {
            throw new Error("Failed to fetch book info");
          }
          const bookData = await res.json();
          if (bookData && !("error" in bookData)) {
            const book: BookProps = bookData;
            if (process.env.NODE_ENV !== "production") {
              console.log("请求成功", book);
            }
            booksDispatch({ type: "update", book });
          } else {
            toast({
              title: "添加失败",
              description:
                "error" in bookData
                  ? String(bookData.error)
                  : "无法获取书籍信息",
              variant: "destructive",
            });
          }
        } catch {
          toast({
            title: "添加失败",
            description: "无法获取书籍信息，请检查链接是否正确",
            variant: "destructive",
          });
        }
      };
      fetchBookInfo();
    }
  }, [bookUrl, toast]);

  const handleBookAdd = (url: string) => {
    setBookUrl(url);
  };

  const handleDeleteClick = (url: string) => {
    setBookToDelete(url);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      // 如果是批量删除（包含逗号）
      if (bookToDelete.includes(",")) {
        const urls = bookToDelete.split(",");
        booksDispatch({ type: "delete-multiple", urls });
        toast({
          title: "批量删除成功",
          description: `已删除 ${urls.length} 本书籍`,
        });
        setSelectedBooks(new Set());
        setShowDelete(false);
      } else {
        // 单个删除
        booksDispatch({ type: "delete", url: bookToDelete });
        toast({
          title: "删除成功",
          description: "书籍已删除",
        });
      }
      setBookToDelete(null);
    }
  };

  const handleClearConfirm = () => {
    booksDispatch({ type: "clear" });
    setSelectedBooks(new Set());
    setShowDelete(false);
  };

  const toggleBookSelection = (url: string) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedBooks(newSelected);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center flex-col gap-y-10 px-1">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "控制台", href: "/controlpanel" },
            { label: "书柜管理", isPage: true },
          ]}
        />
        <BookForm onBookAdd={handleBookAdd} />
        <div className="flex flex-col gap-y-4 w-[350px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(!showDelete)}
                className="text-sm text-muted-foreground hover:text-foreground min-w-[60px]"
              >
                {showDelete ? "取消" : "管理"}
              </button>
              {showDelete && selectedBooks.size > 0 && (
                <button
                  onClick={() => {
                    const urls = Array.from(selectedBooks);
                    setBookToDelete(urls.join(","));
                    setDeleteDialogOpen(true);
                  }}
                  className="text-sm text-destructive hover:underline"
                >
                  删除选中 ({selectedBooks.size})
                </button>
              )}
            </div>
            <ClearBookshelf
              onClear={handleClearConfirm}
              onOpenDialog={() => setClearDialogOpen(true)}
            />
          </div>
          <BookList
            books={books}
            onDelete={handleDeleteClick}
            showDelete={showDelete}
            selectedBooks={selectedBooks}
            onToggleSelect={toggleBookSelection}
          />
        </div>
      </div>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={
          bookToDelete && bookToDelete.includes(",")
            ? "确认批量删除"
            : "确认删除"
        }
        description={
          bookToDelete && bookToDelete.includes(",")
            ? `确定要删除选中的 ${
                bookToDelete.split(",").length
              } 本书籍吗？此操作无法恢复。`
            : "确定要删除这本书籍吗？此操作无法恢复。"
        }
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
      <ConfirmDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        title="确认清空书柜"
        description="此操作将删除所有书籍，且无法恢复。确定要继续吗？"
        confirmText="确认清空"
        cancelText="取消"
        onConfirm={handleClearConfirm}
        variant="destructive"
      />
    </MainLayout>
  );
}

export default BookshelfPage;
