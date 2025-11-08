"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { throttle } from "@/utils/helper";

interface BookFormProps {
  onBookAdd: (url: string) => void;
}

export function BookForm({ onBookAdd }: BookFormProps) {
  const { toast } = useToast();
  const [displayBookUrl, setDisplayBookUrl] = useState("");
  const [prevBookUrl, setPrevBookUrl] = useState<string>("");

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
      setPrevBookUrl(currentBookUrl); // 更新上一个bookUrl
      onBookAdd(currentBookUrl);

      if (process.env.NODE_ENV !== "production") {
        console.log("handleSubmit被执行", currentBookUrl);
      }
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

  return (
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
  );
}
