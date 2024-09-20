import { useEffect, useState } from "react";

async function get_word_info(word: string) {
  let translation = "no result";
  let pronunciation = "no result";
  let is_star = false;
  let response = await chrome.runtime.sendMessage({query: 'word_info', word: word});
  translation = response.translate === "" ? "no result" : response.translate;
  pronunciation = response.pronunciation === "" ? "no result" : response.pronunciation;
  is_star = response.is_star === "" ? "no result" : response.is_star;
  return {translation, pronunciation, is_star};
}

export const Bubble = ({ word, is_open }: {word: string, is_open: boolean}) => {
  const [translationData, setTranslationData] = useState("");
  const [pronunciationData, setPronunciationData] = useState("");
  const [star, setStar] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await get_word_info(word);
      setTranslationData(data.translation);
      setPronunciationData(data.pronunciation);
      setStar(data.is_star);
    })();

  }, [is_open]);

  function switch_star() {
    (async() => {
      if(star) {
        await chrome.runtime.sendMessage({query: 'remove_star', word: word});
      } else {
        await chrome.runtime.sendMessage({query: 'add_star', word: word});
      }
    })();
    setStar(!star);
  }

  if (!translationData) {
    return <span className="loading loading-dots loading-lg"></span>;
  }

  async function sound() {
    await chrome.runtime.sendMessage({query: 'tts_speak', word: word});
  }

  return (
    <div className="my-3 min-w-36 inline-block rounded-lg font-normal font-sans overflow-visible box-content aspect-auto max-auto shadow-2xl">
      <div className="rounded-lg py-4 px-4 border border-slate-400 *:dark:border-slate-600 backdrop-blur-sm dark:bg-slate-950/80 bg-gray-100/90">
      <div className="flex items-center">
        <div className=" text-lg text-black dark:text-slate-50 font-bold tracking-wider whitespace-nowrap mr-8">{word}</div>

        <div className="fill-indigo-400 hover:fill-indigo-200 text-xs" 
              onClick={switch_star}>
          {star ? 
            <div className="tooltip tooltip-right" data-tip="starred">
              <svg className="mt-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            </div>
            : 
            <div className="tooltip tooltip-right" data-tip="star">
              <svg className="mt-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>
            </div>
          }
        </div>

        </div>

        <div className="mt-3 flex">

          <div className="border rounded-lg border-indigo-400 px-1 whitespace-nowrap text-sm italic text-indigo-400 dark:text-indigo-400">{pronunciationData}</div>

          <div className="ml-2 mr-12 flex items-center " onClick={sound}>
            <svg className="fill-indigo-400 hover:fill-indigo-200" xmlns="http://www.w3.org/2000/svg" height="15" width="17" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
          </div>

        </div>

        <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed mt-3">{translationData}</div>
      </div>
    </div>
  );
};
