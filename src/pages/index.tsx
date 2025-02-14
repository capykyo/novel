import Link from "next/link";
import MainLayout from "../layouts/MainLayout"; import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

const features = [
  {
    Icon: FileTextIcon,
    name: "正在阅读: ",
    description: "文章简介",
    href: "/article?initialArticleNumber=1",
    cta: "继续阅读",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "更换新书",
    description: "当前书籍已经阅读完毕",
    href: "/add-book",
    cta: "替换",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: CalendarIcon,
    name: "阅读时长控制",
    description: "设置阅读时长",
    href: "/settings",
    cta: "设置",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  }
];

function HomePage() {
  return (
    <MainLayout>
      <div>
        <h1>魔法阅读，一个AI赋能的阅读器</h1>
        <p>
          3大核心功能
        </p>
      </div>
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </MainLayout>
  );
}

export default HomePage;
