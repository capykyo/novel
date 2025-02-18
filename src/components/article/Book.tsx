"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookContext } from "@/contexts/BookContext";
import { useEffect } from "react";
import cookie from "js-cookie";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Book({ bookUrl }: { bookUrl: string }) {
  const { data, error } = useSWR(
    bookUrl ? `/api/fetchBookInfo?url=${bookUrl}` : null,
    fetcher
  );
  const { setBookInfo } = useBookContext();

  useEffect(() => {
    if (data) {
      const bookInfo = JSON.stringify(data);
      localStorage.setItem("bookInfo", bookInfo);
      cookie.set("bookInfo", bookInfo, { expires: 3650 });
      setBookInfo(data);
    }
  }, [data, setBookInfo]);

  if (error) return <div>加载失败</div>;

  return (
    <div>
      {!data ? (
        <div>等待加载...</div>
      ) : (
        <Card className="relative w-[350px] overflow-hidden">
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-x-2">
            <Image src={data.img} alt={data.title} />
            <div className="flex flex-col gap-y-2">
              <p>{data.description}</p>
              <p>最后一章节: {data.lastChapterNumber}</p>
              <p>书籍地址: {data.url}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Book;
