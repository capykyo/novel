"use client";

import { useState, useEffect } from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { SelectScrollable, SelectScrollableProps } from "./SelectScrollable";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const modelGroups: SelectScrollableProps["groups"] = [
  {
    label: "Deepseek",
    items: [
      {
        text: "DeepSeek-R1 ¥16/M Tokens",
        value: "deepseek-ai/DeepSeek-R1",
      },
      {
        text: "DeepSeek-R1-Distill-Qwen-7B 免费",
        value: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
      },
    ],
  },
  {
    label: "Internlm",
    items: [
      {
        text: "internlm2_5-20b-chat ¥1/M Tokens",
        value: "internlm/internlm2_5-20b-chat",
      },
      {
        text: "Internlm-2.0-7b-instruct 免费",
        value: "internlm/internlm-2.0-7b-instruct",
      },
    ],
  },
];

export function ModelManager() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const { toast } = useToast();

  // 从 storage 读取初始值
  useEffect(() => {
    const savedModel = storage.get<string>("aiModel", "");
    setSelectedModel(savedModel);
  }, []);

  const handleSave = () => {
    try {
      storage.set("aiModel", selectedModel);
      toast({
        title: "保存成功",
        description: "AI 模型已保存",
      });
    } catch {
      toast({
        title: "保存失败",
        description: "无法保存 AI 模型，请重试",
        variant: "destructive",
      });
    }
  };

  const handleValueChange = (value: string) => {
    setSelectedModel(value);
  };

  return (
    <Card className="relative overflow-hidden">
      <BorderBeam
        duration={6}
        size={300}
        reverse
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        size={300}
        className="from-transparent via-green-500 to-transparent"
      />
      <CardHeader>
        <CardTitle>可选 AI 模型</CardTitle>
        <CardDescription>选择您想要使用的 AI 模型</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label>AI 模型</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  选择用于 AI 阅读的模型。免费模型有使用限制，付费模型按 token 计费。
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SelectScrollable
          trigger="选择 AI 模型"
          groups={modelGroups}
          value={selectedModel}
          onValueChange={handleValueChange}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </CardFooter>
    </Card>
  );
}
