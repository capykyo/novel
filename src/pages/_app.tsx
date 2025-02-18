import "@/styles/globals.css";
import "@/styles/article.css";
import type { AppProps } from "next/app";
import { SettingsProvider } from "../contexts/SettingsContext";
import { BookProvider } from "@/contexts/BookContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BookProvider>
      <SettingsProvider>
        <Component {...pageProps} />
      </SettingsProvider>
    </BookProvider>
  );
}
