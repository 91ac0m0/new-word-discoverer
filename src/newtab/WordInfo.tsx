import { useState, useEffect } from "react";

export function WordInfo({word, set_star}: {word:string, set_star:Function}) {

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

    const [translationData, setTranslationData] = useState("");
    const [pronunciationData, setPronunciationData] = useState("");

    useEffect(() => {
        (async () => {
            const data = await get_word_info(word);
            setTranslationData(data.translation);
            setPronunciationData(data.pronunciation);
            set_star(data.is_star);
        })();
    
    }, []);



    return (
        <> 
        { translationData !== "" ?
        <div className="relative">
            <div className="ml-8 mt-8">
                <div className=" rounded-lg inline-block border-l-primary dark:border-d-primary border-2 px-4">
                    <div className="italic text-l-primary dark:text-d-primary text-2xl">{pronunciationData}</div>
                </div>
            </div>
            <div className="ml-8 mt-8 text-l-text dark:text-d-text text-2xl">{translationData}</div>
        </div>
        :
        <span className="loading loading-dots loading-lg"></span>
        }
        </>
    )
}