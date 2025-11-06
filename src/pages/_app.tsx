import "@/styles/globals.css";
import "@/styles/article.css";
import type { AppProps } from "next/app";
import { SettingsProvider } from "../contexts/SettingsContext";
import { BookProvider } from "@/contexts/BookContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <BookProvider>
        <SettingsProvider>
          <Component {...pageProps} />
        </SettingsProvider>
      </BookProvider>
    </ErrorBoundary>
  );
}
