import { useState, useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { Icon } from "@iconify-icon/react";

const GlobalSettingsButton: React.FC = () => {
  const { theme, toggleTheme, textSize, setTextSize } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 关闭菜单函数
  const closeMenu = () => setIsOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 监听点击事件以关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // const handleEscapeKey = (event: KeyboardEvent) => {
    //   if (event.key === "Escape") {
    //     closeMenu();
    //   }
    // };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      //   document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      //   document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-20 right-4" ref={menuRef}>
      {/* Back to Top Button */}
      <div
        onClick={scrollToTop}
        className="text-gray-800 w-8 h-8 bg-white rounded shadow-md opacity-30 hover:opacity-100 transition-opacity duration-300 mb-2"
      >
        <Icon icon="ic:baseline-arrow-circle-up" width="32" height="32" />
      </div>
      {/* Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer text-gray-700 w-8 h-8 bg-white rounded shadow-md opacity-30 hover:opacity-100 transition-opacity duration-300"
      >
        <Icon icon="ic:baseline-apps" width="32" height="32" />
      </div>

      {/* Settings Menu */}
      {isOpen && (
        <div className="absolute right-12 bottom-0 bg-white rounded shadow-md  z-10 text-black flex gap-x-2 h-8 p-1">
          <button onClick={() => toggleTheme()} className="">
            {theme === "day" ? (
              <Icon icon="ic:baseline-brightness-high" width="26" height="26" />
            ) : (
              <Icon icon="ic:baseline-brightness-4" width="26" height="26" />
            )}
          </button>
          <button onClick={() => setTextSize(textSize + 1)} className="">
          <Icon icon="ic:baseline-add-circle-outline" width="26" height="26" />
          </button>
          <button
            onClick={() => setTextSize(Math.max(10, textSize - 1))}
            className=""
          >
            <Icon icon="ic:baseline-remove-circle-outline" width="26" height="26" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalSettingsButton;
