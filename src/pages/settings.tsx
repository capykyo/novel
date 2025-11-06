import MainLayout from "@/layouts/MainLayout";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";

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
import { SelectScrollable, SelectScrollableProps } from "@/components/settings";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useRef, useEffect, useState } from "react";
import { storage } from "@/utils/storage";

export default function SettingsPage() {
  const selectScrollableData: SelectScrollableProps = {
    trigger: "选择 AI 模型",
    groups: [
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
    ],
  };
  const apiKey = useRef<HTMLInputElement>(null);
  const aiModel = useRef<HTMLSelectElement>(null);
  const [restTime] = useState<number>(15);

  useEffect(() => {
    if (apiKey.current) {
      apiKey.current.value = storage.get<string>("apiKey", "");
    }
    if (aiModel.current) {
      aiModel.current.value = storage.get<string>("aiModel", "");
    }
  }, []);
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
            <Label>API KEY</Label>
            <Input ref={apiKey} type="text" placeholder="API KEY" />
            <CardDescription>
              您的API KEY：{apiKey.current?.value}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">清除</Button>
            <Button>保存</Button>
          </CardFooter>
        </Card>
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
            <Label>AI 模型</Label>
            <SelectScrollable {...selectScrollableData} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>保存</Button>
          </CardFooter>
        </Card>
        <Card className="relative overflow-hidden">
          <BorderBeam
            duration={4}
            size={300}
            className="from-transparent via-red-500 to-transparent"
          />
          <CardHeader>
            <CardTitle>重置休息时间</CardTitle>
            <CardDescription>
              重置休息时间，并设置您想要休息的时间
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label>休息时间</Label>
            <NumberTicker
              value={restTime}
              className="whitespace-pre-wrap text-6xl font-medium tracking-tighter text-black dark:text-white"
            />
            <span className="ml-2 text-2xl">分钟</span>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>重置</Button>
          </CardFooter>
        </Card>
      </main>
    </MainLayout>
  );
}
