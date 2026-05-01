import MainLayout from "../layouts/MainLayout";
import { CalendarIcon, FileTextIcon, InputIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useLayoutEffect, useState } from "react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { SpinningText } from "@/components/magicui/spinning-text";
import { BookProps } from "@/types/book";
import { BentoCardProps } from "@/components/magicui/bento-grid";

function ControlPanelPage() {
  const [features, setFeatures] = useState<BentoCardProps[]>([]);
  //init
  useLayoutEffect(() => {
    const files = [
      {
        name: "《AI智能阅读助手》",
        body: "利用先进的AI技术，将长篇小说内容进行智能摘要和提炼，帮助您快速理解故事情节，节省阅读时间。支持多种AI模型，可根据需求选择最适合的阅读模式。",
      },
      {
        name: "《多网站书籍支持》",
        body: "支持从多个小说网站添加书籍，通过统一的解析系统自动识别网站并提取内容。目前已支持全本小说等主流网站，未来将持续扩展更多网站支持。",
      },
      {
        name: "《阅读时长监控》",
        body: "智能追踪您的阅读时长，帮助您合理安排阅读时间。设置休息提醒，保护视力健康。记录您的阅读进度，随时了解自己的阅读习惯和效率。",
      },
      {
        name: "《个性化阅读体验》",
        body: "支持自定义字体大小、主题切换（亮色/暗色模式），打造最适合您的阅读环境。所有设置本地保存，保护您的隐私和数据安全。",
      },
      {
        name: "《书柜管理功能》",
        body: "轻松管理您的阅读书单，支持添加、删除、批量操作。自动保存阅读进度，下次打开时无缝续读。历史记录清晰，方便回顾和继续阅读。",
      },
    ];

    const features = [
      {
        Icon: FileTextIcon,
        name: "正在阅读: ",
        description: "文章简介",
        href: "",
        cta: "继续阅读",
        background: "",
        className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
      },
      {
        Icon: InputIcon,
        name: "管理书架",
        description:
          "轻松管理您的阅读书单，支持添加、删除、批量操作。自动保存阅读进度，下次打开时无缝续读。历史记录清晰，方便回顾和继续阅读。",
        href: "/bookshelf",
        cta: "管理",
        background: (
          <Marquee
            pauseOnHover
            className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
          >
            {files.map((f, idx) => (
              <figure
                key={idx}
                className={cn(
                  "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                  "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                  "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                  "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
                )}
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white ">
                      {f.name}
                    </figcaption>
                  </div>
                </div>
                <blockquote className="mt-2 text-xs">{f.body}</blockquote>
              </figure>
            ))}
          </Marquee>
        ),
        className: "lg:col-start-2 lg:col-end-4 lg:row-start-1 lg:row-end-2",
      },
      {
        Icon: CalendarIcon,
        name: "应用控制",
        description: "设置AI模型、阅读时长、休息时长",
        href: "/settings",
        cta: "设置",
        background: (
          <SpinningText className="absolute top-1/3 right-1/2 text-2xl">
            控制 • 时间 • 停止 • 启动 • 阅读 •
          </SpinningText>
        ),
        className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
      },
    ];
    // 获取书籍信息
    const bookInfo: BookProps[] = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("bookInfo")) ||
        "[]"
    );
    if (bookInfo.length > 0) {
      features[0].background = (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${bookInfo[0].img})` }}
        ></div>
      );
      features[0].name = "阅读: " + bookInfo[0]?.title;
      features[0].description = bookInfo[0]?.description || "";
      features[0].href = `/article?number=${bookInfo[0]?.currentChapter}&url=${bookInfo[0]?.url}`;
    } else {
      features[0].name = "阅读: 暂无书籍";
      features[0].description = "请添加书籍";
      features[0].href = "/bookshelf";
    }
    setFeatures(features);
  }, []);
  return (
    <MainLayout>
      <div className="container mx-auto p-4 lg:p-8">
        <BentoGrid className="lg:grid-rows-2">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </MainLayout>
  );
}

export default ControlPanelPage;
