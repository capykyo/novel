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

function AddPage() {
  const { toast } = useToast();
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
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (document.getElementById("bookUrl")) {
                  (
                    document.getElementById("bookUrl") as HTMLInputElement
                  ).value = "";
                }
              }}
            >
              重置
            </Button>
            <Button
              type="button"
              onClick={() => {
                const bookUrlInput = document.getElementById(
                  "bookUrl"
                ) as HTMLInputElement;
                if (bookUrlInput.value) {
                  localStorage.setItem("bookUrl", bookUrlInput.value);

                  toast({
                    title: "添加成功",
                    description: "文章链接：" + bookUrlInput.value,
                  });
                } else {
                  toast({
                    title: "添加失败",
                    description: "请输入正确的文章链接",
                  });
                }
              }}
            >
              更新
            </Button>
          </CardFooter>
          <BorderBeam duration={8} size={100} />
        </Card>
      </div>
    </MainLayout>
  );
}

export default AddPage;
