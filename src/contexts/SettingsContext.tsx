import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

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
    theme: defaultSettings.theme,
    textSize: defaultSettings.textSize,
  });

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === "day" ? "night" : "day";
    setSettings((prev) => ({ ...prev, theme: newTheme }));
  }, [settings.theme]);

  const setTextSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, textSize: size }));
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, toggleTheme, setTextSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
