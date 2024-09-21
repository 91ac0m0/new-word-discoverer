export enum style {
    color,
    underline,
    shadow
}

export interface config {
    is_enabled: boolean,
    black_list: string[],
    white_list: string[],
    word_hl: style;
    show_range: number,
    lang: string,
    dark: boolean;
}


const default_config: config = {
    is_enabled: true,
    black_list: [],
    white_list: [],
    word_hl: style.color,
    lang: "zh",
    show_range: 50,
    dark: false,
}


export async function set_default_config() {
    await chrome.storage.sync.set({"nwd_config": default_config});
}


export async function get_config() {
    const result = await chrome.storage.sync.get(['nwd_config']);
    if(result.nwd_config === undefined) {
        set_default_config();
        return default_config;
    }
    return result.nwd_config;
}

export async function set_config(app_config: config) {
    await chrome.storage.sync.set({"nwd_config": app_config});
}