"use client";

import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";
import {
  ApiKeyManager,
  ModelManager,
  RestTimeManager,
} from "@/components/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Trash2, Search } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const clearStorage = () => {
    if (typeof window === "undefined") return;

    if (isClearing) {
      // 确认清除
      localStorage.clear();
      sessionStorage.clear();
      setIsClearing(false);
      toast({
        title: "清除成功",
        description: "所有存储数据已清除，请刷新页面以使更改生效",
      });
    } else {
      // 第一次点击，需要再次确认
      setIsClearing(true);
      toast({
        title: "确认清除",
        description: "再次点击按钮以确认清除所有存储数据",
        variant: "default",
      });
    }
  };

  const checkStorage = () => {
    if (typeof window === "undefined") return;

    const bookInfo = localStorage.getItem("bookInfo");
    const apiKey = localStorage.getItem("apiKey");
    const settings = localStorage.getItem("settings");
    const aiModel = localStorage.getItem("aiModel");
    const restTime = localStorage.getItem("restTime");

    const storageInfo = [
      `bookInfo: ${bookInfo ? "有数据" : "空"}`,
      `apiKey: ${apiKey ? "已设置" : "未设置"}`,
      `settings: ${settings ? "有数据" : "空"}`,
      `aiModel: ${aiModel ? aiModel : "未设置"}`,
      `restTime: ${restTime ? `${restTime} 分钟` : "未设置"}`,
    ].join("\n");

    toast({
      title: "存储状态",
      description: (
        <pre className="text-xs mt-2 whitespace-pre-wrap">{storageInfo}</pre>
      ),
      duration: 5000,
    });
  };
  return (
    <MainLayout>
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "控制台", href: "/controlpanel" },
          { label: "设置", isPage: true },
        ]}
      />
      <main className="flex justify-center gap-y-4 h-full flex-col w-[350px] mx-auto">
        <ApiKeyManager />
        <ModelManager />
        <RestTimeManager />

        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>存储管理</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      管理本地浏览器存储数据，包括书籍信息、API Key、设置等
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription>清除或检查本地存储的数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={checkStorage}
                variant="outline"
                className="flex-1"
              >
                <Search className="mr-2 h-4 w-4" />
                检查存储状态
              </Button>
              <Button
                onClick={clearStorage}
                variant={isClearing ? "destructive" : "outline"}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isClearing ? "确认清除" : "清除所有数据"}
              </Button>
            </div>
            {isClearing && (
              <div className="text-sm text-muted-foreground bg-destructive/10 p-2 rounded">
                <p>⚠️ 再次点击&ldquo;确认清除&rdquo;按钮以清除所有存储数据</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <p>清除数据后，请刷新页面以使更改生效</p>
          </CardFooter>
        </Card>
      </main>
    </MainLayout>
  );
}
