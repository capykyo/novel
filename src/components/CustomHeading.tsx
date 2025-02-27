import React from "react";

type CustomHeadingProps = {
  level: number;
  children: React.ReactNode;
};

const CustomHeading: React.FC<CustomHeadingProps> = ({ level, children }) => {
  const Tag = `h${level}` as React.ElementType; // 使用 React.ElementType 替代 keyof JSX.IntrinsicElements

  // 根据级别设置字体大小
  const fontSizeClass = {
    1: "text-4xl", // h1
    2: "text-3xl", // h2
    3: "text-2xl", // h3
    4: "text-xl", // h4
    5: "text-lg", // h5
  }[level];

  return <Tag className={`${fontSizeClass} font-bold mb-2`}>{children}</Tag>;
};

export default CustomHeading;
