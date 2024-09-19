import { set_default_config} from "./config";
import { load_dictionary, load_idioms } from "./dictionary";
import { get_config} from "./config";
import tr from "googletrans";

// on installed 
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        load_dictionary();
        load_idioms();
        set_default_config();
    }
});


// event handler
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.query === "hostname" && sender.tab?.url) {
        var url = new URL(sender.tab.url);
        var domain = url.hostname;
        sendResponse({hostname: domain});
    } else if (request.query === "page_language" && sender.tab?.id) {
        chrome.tabs.detectLanguage(sender.tab.id, function(iso_language_code) {
            sendResponse({wdm_iso_language_code: iso_language_code});
        });
        return true;
    } else if (request.wdm_verdict && sender?.tab) {
        if (request.wdm_verdict === "keyboard") {
            chrome.browserAction.setIcon({path: "images/fox.png", tabId: sender.tab.id});
        } else {
            chrome.browserAction.setIcon({path: "images/fox.png", tabId: sender.tab.id});
        }
    } else if (request.wdm_new_tab_url) {
        var fullUrl = request.wdm_new_tab_url;
        chrome.tabs.create({'url': fullUrl}, function () { });
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


// not CORS in content script
chrome.runtime.onMessage.addListener(
    // you must define the listener as a non-sync function
    function(request, _, sendResponse) {
        if (request.query == 'google_translate') {
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
                    sendResponse({translate: translate_string, pronunciation: pronunciation_string});
                })
                .catch(function (error) {
                    console.log(error);
                    sendResponse({translate: "network error"});
                }))
            return true;
        }
    }
)

async function get_config_lang() {
    const app_config = await get_config();
    return app_config.lang;
}