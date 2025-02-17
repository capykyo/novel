import Link from "next/link";
import MainLayout from "@/layouts/MainLayout";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { ShinyButton } from "@/components/magicui/shiny-button";

export function ShinyButtonDemo() {
  return <ShinyButton>Shiny Button</ShinyButton>;
}

import { cn } from "@/lib/utils";

function HomePage() {
  return (
    <MainLayout>
      <div className="absolute top-0 left-0 w-full min-h-screen opacity-30">
        <DotPattern
          width={10}
          height={10}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] "
          )}
        />
      </div>
      <div className="flex flex-col items-start justify-center p-8 gap-y-10">
        <h1 className="text-4xl font-bold">
          <p className="leading-[1.6]">魔法阅读</p>
          <p className="leading-[1.6]">一个AI赋能的阅读器</p>
        </h1>
        <div className="text-lg">
          <p className="">
            <span className="underline underline-offset-4">高效</span>
            <span>，</span>
            <span className="underline underline-offset-4">阅读时长监控</span>
            <span>，</span>
            <span className="underline underline-offset-4">AI赋能</span>
            <span>，</span>
            <span className="underline underline-offset-4">轻易部署</span>
            <span>，</span>
            <span className="">通过大模型API实现</span>
          </p>
        </div>
        <div className="">
          <Link href="/user">
            <ShinyButton>Try it now</ShinyButton>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default HomePage;
