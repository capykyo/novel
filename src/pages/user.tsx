import MainLayout from "../layouts/MainLayout";
import { CalendarIcon, FileTextIcon, InputIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Marquee } from "@/components/magicui/marquee";
import { SpinningText } from "@/components/magicui/spinning-text";

const files = [
  {
    name: "《比特币革命：数字货币时代的新机遇与挑战》",
    body: "本书深入探讨了比特币这一2008年由神秘人物或团体以中本聪之名发明的加密货币。书中不仅讲述了比特币的基本原理和技术基础，还分析了其对现代经济体系的影响以及未来发展的潜力。",
  },
  {
    name: "《财务管理精要：从基础到精通》",
    body: "这是一本详细介绍如何使用电子表格来整理、安排和计算财务数据的指南。通过实例和案例研究，读者可以学习到如何高效地利用电子表格进行数据分析，从而更好地做出财务决策。",
  },
  {
    name: "《SVG图形设计：动画与交互的艺术》",
    body: "本书专注于可缩放矢量图形（SVG），这是一种基于XML的二维图形格式，支持交互性和动画效果。书中讲解了如何创建、编辑和优化SVG图像，并展示了如何在网页设计和其他领域中应用这些技术。",
  },
  {
    name: "《GPG加密实战：保护你的数字世界》",
    body: "本书详细介绍了GPG密钥的使用方法，包括电子邮件、文件、目录甚至整个磁盘分区的加密和解密过程。此外，还讲解了如何使用GPG密钥验证消息的真实性，为个人隐私和数据安全提供坚实保障。",
  },
  {
    name: "《比特币种子短语完全指南》",
    body: "种子短语是恢复比特币资金链上所需的所有信息的词汇列表。这本书全面解析了种子短语的重要性、生成方法及其在比特币钱包管理和资金恢复中的应用。",
  },
];

const features = [
  {
    Icon: FileTextIcon,
    name: "正在阅读: ",
    description: "文章简介",
    href: "/article?initialArticleNumber=1",
    cta: "继续阅读",
    background: "",
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "更换新书",
    description: "当前书籍已经阅读完毕",
    href: "/add-book",
    cta: "替换",
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
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: CalendarIcon,
    name: "阅读时长控制",
    description: "设置阅读时长",
    href: "/settings",
    cta: "设置",
    background: (
      <SpinningText className="absolute top-1/3 right-1/2 text-2xl">
        控制 • 时间 • 停止 • 启动 • 阅读 •
      </SpinningText>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
];

function UserPage() {
  return (
    <MainLayout>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </MainLayout>
  );
}

export default UserPage;
