import "@/styles/globals.css";
import { Header, Footer } from "@/components/layout";
import GlobalSettingsButton from "@/components/GlobalSettingsButton";
import { useSettings } from "../contexts/SettingsContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useSettings();
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out ${
        theme === "day" ? "day-theme" : "night-theme"
      }`}
    >
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="grow container mx-auto p-4">{children}</main>

      <GlobalSettingsButton />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
