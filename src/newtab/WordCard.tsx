import { useEffect, useState } from "react";
import { WordInfo } from "./WordInfo";

export function WordCard({word}: {word: string}) {

    const [show, setShow] = useState(false);
    const [star, setStar] = useState(true);


    useEffect(() => {
        setShow(false);
    }, [word]);

    function click_to_show() {
        setShow(true);
    }

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

    function update_star_status(new_status: boolean) {
        setStar(new_status);
    }
    
    return (
        <div className="flex flex-col h-full">
            <div className="h-1/4"></div>
            <div className="h-2/4 relative">

                <h1 className="truncate text-8xl font-mono font-bold text-l-text dark:text-d-text">
                    {word}
                </h1>

                {show?
                    <WordInfo word={word} set_star={update_star_status}></WordInfo>
                :
                <div onClick={click_to_show}>
                    <div className="ml-8 mt-8">
                        <div className="skeleton w-32 h-8 inline-block dark:bg-indigo-500 bg-indigo-300"></div>
                    </div>
                    <div className="skeleton ml-8 mt-8 w-96 h-8 dark:bg-slate-800 bg-gray-400"></div>
                    <div className="skeleton ml-8 mt-8 w-64 h-8 dark:bg-slate-800 bg-gray-400"></div>
                </div>

                }

                <div className="text-xs absolute right-0 bottom-0" 
                onClick={switch_star}>
                {star ? 
                    <button className="w-52 btn btn-lg btn-active btn-primary">REMOVE FROM STAR LIST</button>
                    : 
                    <button className="w-52 btn btn-lg btn-outline btn-primary">ADD TO STAR LIST</button>
                }
            </div>

            </div>
            <div className="h-1/4"></div>
        </div>
    )
}