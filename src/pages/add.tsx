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
import { useState } from "react";
import { debounce, throttle } from "@/utils/helper";
import { Book } from "@/components/article";
import cookie from "js-cookie";
function AddPage() {
  const { toast } = useToast();
  const [bookUrl, setBookUrl] = useState("");

  const handleSubmit = () => {
    toast({
      title: "添加成功",
      description: "文章链接：" + bookUrl,
    });
    //清除cookie以及localstorage
    cookie.remove("articleNumber");
    localStorage.removeItem("articleNumber");
  };

  const handleReset = () => {
    setBookUrl("");
    toast({
      title: "清除输入",
      description: "输入已清除",
    });
  };

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
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="bookUrl">书籍链接</Label>
                  <Input
                    id="bookUrl"
                    type="text"
                    placeholder="Enter your book url"
                    value={bookUrl}
                    onChange={throttle((e) => setBookUrl(e.target.value), 500)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleReset}>
              重置
            </Button>
            <Button type="button" onClick={debounce(handleSubmit, 300)}>
              更新
            </Button>
          </CardFooter>
          <BorderBeam duration={8} size={100} />
        </Card>
        <Book bookUrl={bookUrl} />
      </div>
    </MainLayout>
  );
}

export default AddPage;
