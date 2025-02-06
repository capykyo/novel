import React from "react";
import { useSettings } from "../contexts/SettingsContext";

const SettingsDisplay: React.FC = () => {
  const { theme, textSize } = useSettings();

  return (
    <div
      style={{
        fontSize: `${textSize}px`,
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <p>{theme}</p>
      <p>
        <strong>字体大小:</strong> {textSize}px
      </p>
    </div>
  );
};

export default SettingsDisplay;
