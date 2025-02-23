"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import MainLayout from "@/layouts/MainLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import { useState, useLayoutEffect, useEffect, useReducer } from "react";
import { throttle } from "@/utils/helper";
import { Book } from "@/components/article";
import { useBookContext } from "@/contexts/BookContext";
import { BookProps } from "@/types/book";

type ActionProps = {
  type: "init" | "update" | "delete";
  book?: BookProps;
  books?: BookProps[];
};
// 限制历史记录数量
const MAX_HISTORY_COUNT = 10;

function AddPage() {
  const { toast } = useToast();
  const [bookUrl, setBookUrl] = useState("");
  const [displayBookUrl, setDisplayBookUrl] = useState("");
  useBookContext();
  const [prevBookUrl, setPrevBookUrl] = useState<string>("");
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
          if (state.length >= MAX_HISTORY_COUNT) {
            return state.slice(0, MAX_HISTORY_COUNT - 1);
          }
          return [action.book, ...state];
        }
        return state;
      default:
        return state;
    }
  };
  const [books, booksDispatch] = useReducer(reducerAction, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const currentBookUrl = (
      form.elements.namedItem("bookUrl") as HTMLInputElement
    ).value;
    // 为空，不执行
    if (!currentBookUrl) return;

    // 只有当当前的bookUrl与上一个不同才执行
    if (currentBookUrl !== prevBookUrl) {
      setBookUrl(currentBookUrl);
      setPrevBookUrl(currentBookUrl); // 更新上一个bookUrl

      console.log("handleSubmit被执行", currentBookUrl);
      toast({
        title: "添加成功",
        description: "文章链接：" + currentBookUrl,
      });
    }
  };

  const handleReset = () => {
    setDisplayBookUrl("");
    toast({
      title: "清除输入",
      description: "输入已清除",
    });
  };
  // init
  useLayoutEffect(() => {
    const storedBooks: BookProps[] = JSON.parse(
      localStorage.getItem("bookInfo") || "[]"
    );
    if (storedBooks) {
      booksDispatch({ type: "init", books: storedBooks });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookInfo", JSON.stringify(books));
  }, [books]);

  // 当input输入框输入内容时，调用
  useEffect(() => {
    if (bookUrl) {
      console.log("url被更新", bookUrl);
      const fetchBookInfo = async () => {
        const res = await fetch(`/api/fetchBookInfo?url=${bookUrl}`);
        const book: BookProps = await res.json();
        if (book) {
          console.log("请求成功", book);
          booksDispatch({ type: "update", book });
        }
      };
      fetchBookInfo();
    }
  }, [bookUrl]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center flex-col gap-y-10 px-1">
        <Breadcrumb className="self-start">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/user">控制台</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>更新书籍</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="relative w-[350px] overflow-hidden">
          <CardHeader>
            <CardTitle>更新书籍</CardTitle>
            <CardDescription>输入你要增加的书籍链接</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bookUrl">书籍链接</Label>
                  <Input
                    id="bookUrl"
                    name="bookUrl"
                    type="text"
                    placeholder="输入书籍链接"
                    value={displayBookUrl}
                    onChange={throttle(
                      (e) => setDisplayBookUrl(e.target.value),
                      500
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleReset}>
                重置
              </Button>
              <Button type="submit">更新</Button>
            </CardFooter>
          </form>
          <BorderBeam duration={8} size={100} />
        </Card>
        <div className="flex flex-col gap-y-2">
          {books.map((book, index) => {
            if (index === 0) {
              return (
                <div
                  key={`reading-${book.url}`}
                  className="flex flex-col gap-y-4"
                >
                  <div>正在阅读：</div>
                  <Book key={book.url} book={book} />
                  <div>历史记录：</div>
                </div>
              );
            }
            return <Book key={book.url} book={book} />;
          })}
        </div>
      </div>
    </MainLayout>
  );
}

export default AddPage;
