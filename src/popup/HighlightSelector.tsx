import React, { useEffect, useState } from 'react';
import { style, get_config, set_config, config } from '../scripts/config';

let app_config: config;
const STYLES = ["color", "underline", "shadow"];

export const HighlightSelector = () => {
  const [wordStyle, setWordStyle] = useState<string>("color");

  useEffect(() => {
    (async () => {
      app_config = await get_config();
      setWordStyle(style[app_config.word_hl]);
    })();
  }, []);
  
  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedStyle: string = event.target.value;
    setWordStyle(selectedStyle);
    (async () => {
      app_config.word_hl = STYLES.indexOf(selectedStyle);
      await set_config(app_config);
    })();
  };

  return (
    <select 
    className="w-36 dropdown select select-primary dark:bg-d-background dark:text-white"
    onChange={handleLanguageChange}
    value={wordStyle}
    >
      {
        wordStyle && (
          <option value={wordStyle} disabled>
            Style: {wordStyle}
          </option>
        )
      }
    {Object.entries(STYLES).map(([key, value]) => (
        <option key={key} value={value}>{value}</option>
    ))}
    </select >
  );
}
