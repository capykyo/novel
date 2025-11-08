"use client";

import { useState, useEffect, useRef } from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 从 storage 读取初始值
  useEffect(() => {
    const savedApiKey = storage.get<string>("apiKey", "");
    setApiKey(savedApiKey);
    if (inputRef.current) {
      inputRef.current.value = savedApiKey;
    }
  }, []);

  const handleSave = () => {
    try {
      storage.set("apiKey", apiKey);
      toast({
        title: "保存成功",
        description: "API Key 已保存",
      });
    } catch {
      toast({
        title: "保存失败",
        description: "无法保存 API Key，请重试",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setApiKey("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    storage.remove("apiKey");
    toast({
      title: "已清除",
      description: "API Key 已清除",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setApiKey(value);
  };

  // 部分隐藏 API Key（只显示前 4 位和后 4 位）
  const maskApiKey = (key: string) => {
    if (!key || key.length <= 8) {
      return key;
    }
    return `${key.slice(0, 4)}${"*".repeat(key.length - 8)}${key.slice(-4)}`;
  };

  return (
    <Card className="relative overflow-hidden">
      <BorderBeam
        duration={4}
        size={300}
        reverse
        className="from-transparent via-green-500 to-transparent"
      />
      <CardHeader>
        <CardTitle>API KEY</CardTitle>
        <CardDescription>输入您的API KEY</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label>API KEY</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  请输入您的 OpenAI API Key。此密钥仅存储在本地浏览器中，不会上传到服务器。
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="API KEY"
          onChange={handleInputChange}
        />
        <CardDescription className="mt-2">
          您的API KEY：{apiKey ? maskApiKey(apiKey) : "未设置"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear}>
          清除
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </CardFooter>
    </Card>
  );
}
