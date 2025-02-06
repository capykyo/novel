import MainLayout from "../layouts/MainLayout";
// import SettingsDisplay from "../components/SettingsDisplay";
import ArticleDisplay from "../components/ArticleDisplay";

function getInitialArticleNumber(): number {
  if (typeof window !== "undefined") {
    const savedNumber = localStorage.getItem("articleNumber");
    return savedNumber ? parseInt(savedNumber, 10) : 649;
  }
  // 如果在服务端，返回默认值
  return 1;
}

export default function Home() {
  const initialArticleNumber = getInitialArticleNumber();

  return (
    <MainLayout>
      <div className="">
        <ArticleDisplay initialArticleNumber={initialArticleNumber} />
      </div>
    </MainLayout>
  );
}
