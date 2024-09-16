import { set_default_config} from "./config";
import { load_dictionary, load_idioms } from "./dictionary";



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
    if (request.wdm_request == "hostname" && sender.tab?.url) {
        var url = new URL(sender.tab.url);
        var domain = url.hostname;
        sendResponse({wdm_hostname: domain});
    } else if (request.wdm_request == "page_language" && sender.tab?.id) {
        chrome.tabs.detectLanguage(sender.tab.id, function(iso_language_code) {
            sendResponse({wdm_iso_language_code: iso_language_code});
        });
        return true;
    } else if (request.wdm_verdict && sender?.tab) {
        if (request.wdm_verdict == "keyboard") {
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
    if (request.type = "tts_speak") {
        if (!!request.word && typeof request.word === "string") {
            chrome.tts.speak(request.word, {lang: "en", gender: "male"})
        }
    }
});