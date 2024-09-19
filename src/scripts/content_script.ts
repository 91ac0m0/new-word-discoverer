import { get_config, config} from "./config"
import { dictionary, get_dict } from "./dictionary";
import { highlight_node } from "../components/highlight";
import { createRoot, Root } from "react-dom/client";
import '../index.css';

let app_config: config;
let dict: dictionary;
const good_tags_list = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "B", "SMALL", "STRONG", "Q", "DIV", "SPAN"];
let highlight_count = 0;
let nwd_root: Root;
let highlightedElements: React.ReactPortal[] = [];

function get_root() : boolean {
    nwd_root = createRoot(document.createElement('nwd_root'));
    return true;
}


function find_highlight_word(node_tokens: string[]) : string[] {
    let word_list = [];
    for(const token of node_tokens) {
        // show a range of words
        if(dict.get_index(token) > dict.get_size()*app_config.show_range*0.01) {
            word_list.push(token);
        }
    }
    return word_list;
}

function text_to_highlight_node(node: Node) {
    if(!(node.textContent && node.parentElement)) {
        return 0;
    }

    const node_tokens = node.textContent.toLowerCase()
                    .replace(/[,;()?!`:"'.\s\-\u2013\u2014\u201C\u201D\u2019]/g, " ")
                    .replace(/[^\w ]/g, ".")
                    .split(" ");
    
    if(!node_tokens){
        return 0;
    }

    const word_list = find_highlight_word(node_tokens);

    if (word_list.length > 0) {
        const highlight = highlight_node(node, word_list, app_config.word_hl);
        if( highlight === null) {
            return 0;
        }
        highlightedElements.push(highlight);
    }
    return word_list.length;
}


function process_html_nodes(el: Node) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, 
    (node) => {
        if (node.parentElement && node.parentElement.tagName && good_tags_list.includes(node.parentElement.tagName.toUpperCase())){
            return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
    })

    let last_node = null;
    let last_highlight = 0;
    
    while (walker.nextNode()) {
        last_highlight = text_to_highlight_node( walker.currentNode );
        if(last_node !== null && last_node.parentElement ) {
            const parent_node = last_node.parentElement;
            parent_node.removeChild(last_node);
            last_node = null;   
        }
        if(last_highlight > 0) {
            highlight_count += last_highlight;
            last_node = walker.currentNode
        }
        if(highlight_count > 10000) {
            break;
        }
    }
    if(last_node !== null && last_node.parentElement ) {
        const parent_node = last_node.parentElement;
        parent_node.removeChild(last_node);
        last_node = null;   
    }
}


async function should_highlight_page() {
    const response = await chrome.runtime.sendMessage({query: "hostname"});
    if (!response) {
        return 'unknown error';
    }

    const hostname = response.hostname;
    if (app_config.black_list.includes(hostname)) {
        return "site in \"Skip List\"";
    }

    if (app_config.white_list.includes(hostname)) {
        return "highlight";
    }

    if (!app_config.is_enabled) {
        return "site is not in \"Favorites List\"";
    }
    
    const lang_response = await chrome.runtime.sendMessage({query: "page_language"});
    if (!lang_response) {
        return 'unknown error';
    }
    return lang_response.wdm_iso_language_code === 'en' ? "highlight" : "page language is not English";
}


async function init_page() {
    if(!get_root()){
        return;
    }

    app_config = await get_config();
    const highlight_status = await should_highlight_page();
    
    if(highlight_status !== "highlight") {
        return;
    }

    dict = await get_dict();
    process_html_nodes(document.body);
    nwd_root.render(highlightedElements);
}

chrome.runtime.onMessage.addListener((request) => {
    if(request.query === "highlight") {
        (async () => {
            dict = await get_dict();
            process_html_nodes(document.body);
            nwd_root.render(highlightedElements);
        })();
    }
});

init_page();