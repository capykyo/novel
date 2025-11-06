import { Header, Footer } from "@/components/layout";
import GlobalSettingsButton from "@/components/GlobalSettingsButton";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Toaster } from "@/components/ui/toaster";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSettingButtonShown, setIsSettingButtonShown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { pathname } = router;
    setIsSettingButtonShown(pathname === "/article" || pathname === "/aireading");
  }, [router]);
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out dark:bg-black dark:text-white`}
    >
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="grow container mx-auto p-4">{children}</main>

      <Toaster />

      {isSettingButtonShown && <GlobalSettingsButton />}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
