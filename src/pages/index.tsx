import type { GetServerSideProps } from "next";
import MainLayout from "../layouts/MainLayout";
import ArticleDisplay from "../components/ArticleDisplay";

function getInitialArticleNumber(articleNumberFromServer?: string | null): number {
  if (typeof window !== "undefined") {
    const savedNumber = localStorage.getItem("articleNumber");
    return savedNumber
      ? parseInt(savedNumber, 10)
      : parseInt(articleNumberFromServer || "649", 10);
  }
  // 如果在服务端，返回默认值
  return parseInt(articleNumberFromServer || "1", 10);
}

export default function Home({
  articleNumberFromServer,
}: {
  articleNumberFromServer: string | null;
}) {
  const initialArticleNumber = getInitialArticleNumber(articleNumberFromServer);

  return (
    <MainLayout>
      <div className="">
        <ArticleDisplay initialArticleNumber={initialArticleNumber} />
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 从 cookie 中获取 articleNumber
  const articleNumberFromCookie = context.req.cookies.articleNumber === undefined ? null : context.req.cookies.articleNumber;

  return {
    props: {
      articleNumberFromServer: articleNumberFromCookie,
    },
  };
};
