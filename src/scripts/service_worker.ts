import { set_default_config} from "./config";
import { get_star_dict, load_dictionary, set_star_dict } from "./dictionary";
import { get_config} from "./config";
import tr from "googletrans";

let star_dict: string[];

// on installed 
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        load_dictionary();
        set_default_config();
    }
});


// event handler
// you must define the listener as a non-sync function
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.query === "hostname" && sender.tab?.url) {
        var url = new URL(sender.tab.url);
        var domain = url.hostname;
        sendResponse({hostname: domain});
    } else if (request.query === "page_language" && sender.tab?.id) {
        chrome.tabs.detectLanguage(sender.tab.id, function(iso_language_code) {
            sendResponse({wdm_iso_language_code: iso_language_code});
        });
    
    // not CORS in content script
    } else if (request.query === 'word_info') {
        get_config_lang()
        .then(lang => 
            tr(request.word, {to: lang, from: "en"})
            .then(function (result) {
                const top_5_translate = result.translations.length > 5 ? result.translations.slice(0, 5) : result.translations;
                console.log(lang);
                const translate_string = top_5_translate
                    .map(item => item[0])
                    .join("; ")
                // parse raw to get english pronunciation
                let pronunciation_string = ""
                if ((result.raw as any)?.[0]?.[1]?.[3] !== undefined) {
                    pronunciation_string = (result.raw as any)?.[0]?.[1]?.[3];
                }
                const star_status = get_star_status(request.word)
                sendResponse({translate: translate_string, pronunciation: pronunciation_string, is_star: star_status});
            })
            .catch(function (error) {
                console.log(error);
                sendResponse({translate: "network error"});
            })
        )
    } else if (request.query === 'add_star') {
        (async() => {
            add_star(request.word);
        })();
    } else if (request.query === 'remove_star') {
        (async() => {
            remove_star(request.word);
        })();
    } else if (request.query === 'rand_word') {
        (async() => {
            const word = await rand_word();
            console.log(word);
            sendResponse({rand_word: word});
        })();
    }
    return true;
});


chrome.runtime.onMessage.addListener(function (request) {
    // only available in service worker...?
    if (request.query === "tts_speak") {
        if (request.word && typeof request.word === "string") {
            chrome.tts.speak(request.word, {'lang': 'en-US', 'rate': 0.75})
        }
    }
});


async function get_config_lang() {
    const app_config = await get_config();
    return app_config.lang;
}

function get_star_status(word: string) {
    if(star_dict === undefined) {
        (async() => {
            star_dict = await get_star_dict();
        })()
    }
    return star_dict.includes(word);
}


async function add_star(word: string) {
    if(star_dict === undefined) {
            star_dict = await get_star_dict();
    }
    if (!star_dict.includes(word)) {
        star_dict.push(word);
    }
    await set_star_dict(star_dict);
}


async function remove_star(word: string) {
    if(star_dict === undefined) {
        star_dict = await get_star_dict();
    }
    const index = star_dict.indexOf(word);
    if (index !== -1) {
        star_dict.splice(index, 1);
    }
    await set_star_dict(star_dict);
}


async function rand_word() {
    if(star_dict === undefined) {
            star_dict = await get_star_dict();
    }
    if (star_dict.length === 0) return "no star word";
    const idx = Math.floor(Math.random() * star_dict.length);
    return star_dict[idx];
}
