import { useEffect, useState } from "react";
import { WordCard } from "./WordCard";
import { get_config } from "../scripts/config";

export default function Page() {
    const [word, setWord] = useState("");

    async function get_rand_word() {
        const response = await chrome.runtime.sendMessage({query: 'rand_word'});
        setWord(response.rand_word === "no star word" ? "abandon" : response.rand_word);
    }

    useEffect(() => {
        (async() => {
            const app_config = await get_config();
            if (app_config.dark){
                document.querySelector('html')?.classList.add('dark');
              } else {
                document.querySelector('html')?.classList.remove('dark');
            }
        })();
        get_rand_word();
    }, []);

    return <div className="bg-l-background dark:bg-d-background h-screen">
        
        <div className="flex flex-row h-full relative">
            <div onClick={get_rand_word} className="w-2/12 min-w-32 hover:bg-slate-200 dark:hover:bg-slate-800 flex justify-center items-center">
                <svg className="fill-gray-400 dark:fill-gray-700 h-48 w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
            </div>
            
            <div className="w-8/12 flex-grow h-full p-16">

                <WordCard word={word}></WordCard>

            </div>
            <div onClick={get_rand_word} className="w-2/12 min-w-32 hover:bg-slate-200 dark:hover:bg-slate-800 flex justify-center items-center">
                <svg className="fill-gray-400 dark:fill-gray-700 h-48 w-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
            </div>
        </div>
        
    </div>
}