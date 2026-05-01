import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSettings } from "@/contexts/SettingsContext";
type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { textSize } = useSettings();
  return (
    <div
      className="prose prose-lg dark:prose-invert"
      style={{ fontSize: `${textSize}px` }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
