import { useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FirstVisitTestPage() {
  const router = useRouter();

  useEffect(() => {
    // 清除 localStorage（仅用于测试）
    if (typeof window !== "undefined") {
      const cleared = sessionStorage.getItem("test-cleared");
      if (!cleared) {
        console.log("测试模式：清除 localStorage");
        localStorage.clear();
        sessionStorage.setItem("test-cleared", "true");
      }
    }
  }, []);

  const testPages = [
    { name: "首页", path: "/" },
    { name: "控制台", path: "/controlpanel" },
    { name: "添加书籍", path: "/add" },
    { name: "设置", path: "/settings" },
    { name: "文章（无参数 - 应重定向）", path: "/article" },
    { name: "AI 阅读（无参数 - 应重定向）", path: "/aireading" },
  ];

  const clearStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      sessionStorage.removeItem("test-cleared");
      alert("已清除所有存储数据，刷新页面后生效");
    }
  };

  const checkStorage = () => {
    if (typeof window !== "undefined") {
      const bookInfo = localStorage.getItem("bookInfo");
      const apiKey = localStorage.getItem("apiKey");
      const settings = localStorage.getItem("settings");
      
      alert(
        `当前存储状态:\n` +
        `- bookInfo: ${bookInfo ? "有数据" : "空"}\n` +
        `- apiKey: ${apiKey ? "已设置" : "未设置"}\n` +
        `- settings: ${settings ? "有数据" : "空"}`
      );
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>首次访问测试工具</CardTitle>
            <CardDescription>
              此页面用于测试新用户首次访问网站时各页面的工作情况
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={clearStorage} variant="destructive">
                清除所有存储数据
              </Button>
              <Button onClick={checkStorage} variant="outline">
                检查存储状态
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>⚠️ 注意：清除存储数据后，请刷新页面以使更改生效</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>测试页面列表</CardTitle>
            <CardDescription>点击下方按钮访问各个页面进行测试</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testPages.map((page) => (
                <Button
                  key={page.path}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start"
                  onClick={() => router.push(page.path)}
                >
                  <span className="font-semibold">{page.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {page.path}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>测试检查清单</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>✅ 所有页面都能正常加载</li>
              <li>✅ 无 JavaScript 错误（检查浏览器控制台）</li>
              <li>✅ 无控制台警告</li>
              <li>✅ 页面布局正常</li>
              <li>✅ 导航链接正常工作</li>
              <li>✅ 空状态提示清晰（如&ldquo;暂无书籍&rdquo;）</li>
              <li>✅ 错误信息友好（如 API Key 缺失提示）</li>
              <li>✅ 重定向逻辑正确（无参数时重定向到控制台）</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

