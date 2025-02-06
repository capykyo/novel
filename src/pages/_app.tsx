import "@/styles/globals.css";
import "@/styles/article.css";
import type { AppProps } from "next/app";
import { SettingsProvider } from "../contexts/SettingsContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  );
}
