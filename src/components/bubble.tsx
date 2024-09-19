import { useEffect, useState } from "react";

async function translation_and_pronunciation(word: string) {
  let translation = "no result";
  let pronunciation = "no result";
  let response = await chrome.runtime.sendMessage({query: 'google_translate', word: word});
  translation = response.translate === "" ? "no result" : response.translate;
  pronunciation = response.pronunciation === "" ? "no result" : response.pronunciation;
  return {translation, pronunciation};
}

export const Bubble = ({ word, is_open }: {word: string, is_open: boolean}) => {
  const [translationData, setTranslationData] = useState("");
  const [pronunciationData, setPronunciationData] = useState("");

  useEffect(() => {
    const fetchTranslation = async () => {
      const data = await translation_and_pronunciation(word);
      setTranslationData(data.translation);
      setPronunciationData(data.pronunciation);
    };

    fetchTranslation();
  }, [is_open]);

  if (!translationData) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  async function sound() {
    console.log("11");
    await chrome.runtime.sendMessage({query: 'tts_speak', word: word});
  }

  return (
    <div className="my-3 min-w-36 inline-block rounded-lg font-normal font-sans overflow-visible box-content aspect-auto max-auto shadow-2xl">
      <div className="rounded-lg py-4 px-6 border border-slate-400 *:dark:border-slate-600 backdrop-blur-sm dark:bg-slate-950/80 bg-gray-100/90">
        <div className="text-lg text-black dark:text-slate-50 font-bold tracking-wider whitespace-nowrap mr-12">{word}</div>
        <div className="mt-3 flex">
          <div className="border rounded-lg border-indigo-400 px-1 whitespace-nowrap text-sm italic text-indigo-400 dark:text-indigo-400">{pronunciationData}</div>
          <div className="ml-2 mr-12 flex items-center " onClick={sound}>
            <svg className="fill-indigo-400 hover:fill-indigo-200" xmlns="http://www.w3.org/2000/svg" height="15" width="17" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
          </div>
        </div>
        <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mt-3">{translationData}</div>
      </div>
      {/* <div className="flex-grow-1 w-1/4">
        <div className="flex flex-col h-full">
          <div className="h-1/2 rounded-tr-xl border border-slate-600 flex items-center justify-center backdrop-blur-md bg-white dark:bg-sky-950 bg-opacity-60  hover:bg-opacity-70"></div>
          <div className="h-1/2 rounded-br-xl border-x border-b border-slate-600 flex items-center justify-center backdrop-blur-md bg-white dark:bg-sky-950 bg-opacity-60 hover:bg-opacity-70"></div>
        </div>
      </div> */}
    </div>
  );
};
