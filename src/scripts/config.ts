
export interface style {
    color: boolean,
    underline: boolean,
    background: boolean
}

export interface config {
    is_enabled: boolean,
    black_list: string[],
    white_list: string[],

    highlight_style: {
        word_hl: style;
        idiom_hl: style;
    };

    show_rank: number,

    lang: string,
}


const default_config: config = {

    is_enabled: true,
    black_list: [],
    white_list: [],

    highlight_style: {
        word_hl:  {
            color: true,
            underline: false,
            background: false
        },
        idiom_hl:  {
            color: true,
            underline: false,
            background: false
        }
    },

    lang: "zh",
    show_rank: 10,
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