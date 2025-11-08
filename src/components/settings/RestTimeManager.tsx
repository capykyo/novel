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
import { NumberTicker } from "@/components/magicui/number-ticker";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_REST_TIME = 15;

export function RestTimeManager() {
  const [restTime, setRestTime] = useState<number>(DEFAULT_REST_TIME);
  const { toast } = useToast();

  // 从 storage 读取初始值
  useEffect(() => {
    const savedRestTime = storage.get<number>("restTime", DEFAULT_REST_TIME);
    setRestTime(savedRestTime);
  }, []);

  const handleSave = () => {
    try {
      storage.set("restTime", restTime);
      toast({
        title: "保存成功",
        description: `休息时间已设置为 ${restTime} 分钟`,
      });
    } catch {
      toast({
        title: "保存失败",
        description: "无法保存休息时间，请重试",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setRestTime(DEFAULT_REST_TIME);
    storage.set("restTime", DEFAULT_REST_TIME);
    toast({
      title: "已重置",
      description: `休息时间已重置为 ${DEFAULT_REST_TIME} 分钟`,
    });
  };

  return (
    <Card className="relative overflow-hidden">
      <BorderBeam
        duration={4}
        size={300}
        className="from-transparent via-red-500 to-transparent"
      />
      <CardHeader>
        <CardTitle>重置休息时间</CardTitle>
        <CardDescription>重置休息时间，并设置您想要休息的时间</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Label>休息时间</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  设置阅读提醒的休息间隔时间，帮助您合理安排阅读节奏。
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center mt-2">
          <NumberTicker
            value={restTime}
            className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-black dark:text-white"
          />
          <span className="ml-2 text-2xl">分钟</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleReset} variant="outline" className="mr-2">
          重置
        </Button>
        <Button onClick={handleSave}>保存</Button>
      </CardFooter>
    </Card>
  );
}
