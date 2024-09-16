import { useEffect, useState } from "react";

async function translation(word: string) {
  const response = await chrome.runtime.sendMessage({query: 'google_translate', word: word});
  const translation = response.translate === "" ? "no result" : response.translate;
  return translation;
}

export const Bubble = ({ word, is_open }: {word: string, is_open: boolean}) => {
  const [translationData, setTranslationData] = useState(null);

  useEffect(() => {
    const fetchTranslation = async () => {
      const data = await translation(word);
      setTranslationData(data);
    };

    fetchTranslation();
  }, [is_open]);

  if (!translationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-normal   font-mono overflow-visible min-w-48 box-content aspect-auto max-auto flex shadow-2xl">
      <div className="flex-grow-3 w-3/4 rounded-l-xl p-2 border-y border-l border-slate-600 backdrop-blur-md bg-white dark:bg-sky-950 bg-opacity-60">
        <div className="text-lg text-black dark:text-slate-50 font-bold">{word}</div>
        <div className="text-slate-500 text-sm">{translationData}</div>
      </div>
      <div className="flex-grow-1 w-1/4">
        <div className="flex flex-col h-full">
          <div className="h-1/2 rounded-tr-xl border border-slate-600 flex items-center justify-center backdrop-blur-md bg-white dark:bg-sky-950 bg-opacity-60  hover:bg-opacity-70"></div>
          <div className="h-1/2 rounded-br-xl border-x border-b border-slate-600 flex items-center justify-center backdrop-blur-md bg-white dark:bg-sky-950 bg-opacity-60 hover:bg-opacity-70"></div>
        </div>
      </div>
    </div>
  );
};
