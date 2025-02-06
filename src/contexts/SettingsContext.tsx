import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";

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
  theme: "day", // 默认为白天模式
  textSize: 16,
};

const SettingsContext = createContext<Settings>({
  ...defaultSettings,
  toggleTheme: () => {},
  setTextSize: () => {},
});

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState({
    theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || defaultSettings.theme : defaultSettings.theme,
    textSize: typeof window !== 'undefined' ? parseInt(localStorage.getItem('textSize') || defaultSettings.textSize.toString(), 10) : defaultSettings.textSize,
  });

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === "day" ? "night" : "day";
    setSettings(prev => ({ ...prev, theme: newTheme }));
  }, [settings.theme]);

  const setTextSize = useCallback((size: number) => {
    setSettings(prev => ({ ...prev, textSize: size }));
  }, []);

  // 当 theme 或 textSize 改变时更新 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('textSize', settings.textSize.toString());
    }
  }, [settings.theme, settings.textSize]); // 这里依赖于 settings.theme 和 settings.textSize

  return (
    <SettingsContext.Provider value={{ ...settings, toggleTheme, setTextSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);