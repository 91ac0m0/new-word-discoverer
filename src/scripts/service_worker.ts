import { set_default_config} from "./config";
import { load_dictionary, load_idioms } from "./dictionary";
import { get_config, config} from "./config";
import tr from "googletrans";

let app_config: config;
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
    if (request.wdm_request === "hostname" && sender.tab?.url) {
        var url = new URL(sender.tab.url);
        var domain = url.hostname;
        sendResponse({wdm_hostname: domain});
    } else if (request.wdm_request === "page_language" && sender.tab?.id) {
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
    } else{

    }
});


chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "tts_speak") {
        if (!!request.word && typeof request.word === "string") {
            chrome.tts.speak(request.word, {lang: "en", gender: "male"})
        }
    }
});


// not CORS in content script
chrome.runtime.onMessage.addListener(
    async function(request, _, sendResponse) {
        if (request.query === 'google_translate') {
            const lang = await get_config_lang();
            // Promise
            tr(request.word, lang)
                .then(function (result) {
                    console.log(result.translations);
                    const top_5_translate = result.translations.length > 5 ? result.translations.slice(0, 5) : result.translations;

                    const translate_string = top_5_translate
                        .map(item => item[0])
                        .join("; ")
                    sendResponse({translate: translate_string});
                })
                .catch(function (error) {
                    console.log(error);
                    sendResponse({translate: "network error"});
                });

        }
        return true;
    }
)

async function get_config_lang() {
    if(app_config === undefined) {
        app_config = await get_config();
    }
    return app_config.lang;
}