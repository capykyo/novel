import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { storage } from "@/utils/storage";

interface Settings {
  theme: string;
  toggleTheme: () => void;
  textSize: number;
  setTextSize: (size: number) => void;
}

interface SettingsProviderProps {
  children: ReactNode; // 明确声明 children 属性
}

const defaultSettings = {
  theme: "light", // 默认为白天模式
  textSize: 16,
};

const SettingsContext = createContext<Settings>({
  ...defaultSettings,
  toggleTheme: () => {},
  setTextSize: () => {},
});

const updateThemeClasses = (theme: string) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light"); // 确保移除 light 类
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light"); // 确保添加 light 类
  }
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState({
    theme: defaultSettings.theme,
    textSize: defaultSettings.textSize,
  });

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    updateThemeClasses(newTheme); // 调用抽离的函数
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  }, [settings.theme]);

  const setTextSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  }, []);

  useEffect(() => {
    storage.set("settings", settings);
  }, [settings]);

  useLayoutEffect(() => {
    const savedSettings = storage.get("settings", defaultSettings);
    if (savedSettings) {
      setSettings(savedSettings);
      updateThemeClasses(savedSettings.theme);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, toggleTheme, setTextSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
