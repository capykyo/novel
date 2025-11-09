import Link from "next/link";
import { Icon } from "@iconify-icon/react";
import { useSettings } from "@/contexts/SettingsContext";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useSettings();
  return (
    <header className="p-4 z-10">
      <h1 className="text-2xl flex items-center gap-2">
        <div className="flex-1">
          <Link href="/">
            {/* <Image src="/logo.png" alt="logo" width={32} height={32} /> */}
            <span className="text-sm font-bold"> Magic Reading</span>
          </Link>
        </div>
        <div className="flex-none flex items-center gap-2">
          <a
            href="https://github.com/capykyo/novel.git"
            target="_blank"
            className="flex items-center"
          >
            <Icon icon="mdi:github" width="26" height="26" />
          </a>
          <button onClick={() => toggleTheme()} className="flex items-center">
            {theme === "light" ? (
              <Icon icon="ic:baseline-brightness-high" width="26" height="26" />
            ) : (
              <Icon icon="ic:baseline-brightness-4" width="26" height="26" />
            )}
          </button>
        </div>
      </h1>
    </header>
  );
};

export default Header;
