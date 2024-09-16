// chrome.storage.local not saving object methods in proto

export class dictionary {
    entries: [string, [string, boolean ]][] = [];
    index_map: Map<string, number> = new Map();
  
    // [dict.entries, Array.from(dict.index_map)]
    constructor(entries: [string, [string, boolean]][] = [], map_array: [string, number][]=[]) {
        this.entries = entries;
        this.index_map = new Map<string, number>(map_array);
    }

    has_key(key: string): boolean {
        return this.index_map.has(key);
    }
  
    get_index(key: string): number {
        return this.index_map.get(key) ?? -1;
    }
  
    get_value_by_index(index: number): [string, boolean] | undefined {
        return this.entries[index]?.[1];
    }
  
    get_value_by_key(key: string): [string, boolean] | undefined {
        const index = this.index_map.get(key);
        return index !== undefined ? this.entries[index][1] : undefined;
    }
  
    insert(key: string, value: [string, boolean]): void {
        if (!this.index_map.has(key)) {
            this.entries.push([key, value]);
            this.index_map.set(key, this.entries.length - 1);
        }
    }

    get_size() {
        return this.index_map.size;
    }
}


let idioms: string[] = [];
let dict: dictionary = new dictionary();

export async function get_dict() : Promise<dictionary> {
    const result = await chrome.storage.local.get(['nwd_dict']);
    if(result.nwd_dict === undefined) {
        load_dictionary();
        return dict;
    }
    let result1 = new dictionary(result.nwd_dict[0], result.nwd_dict[1]);
    return result1;
}


export async function get_idiom() {
    const result = await chrome.storage.local.get(['nwd_idiom']);
    if(result.nwd_idiom === undefined) {
        load_idioms();
        return idioms;
    }
    return result.nwd_idiom;
}


async function load_text(fila_url: string) {
    const file_path = chrome.runtime.getURL(fila_url);

    try {
        const response = await fetch(file_path);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return "";
    }
}


export async function load_idioms() {
    const file_text = await load_text("src/assets/eng_idioms.txt");
    const lines = file_text.split('\n');

    for (const line of lines) {
        const fields = line.split('\t');
        idioms.push(fields[0]);
        idioms.push(fields[1]);
    }
    await chrome.storage.local.set({"nwd_idioms": idioms});
}


export async function load_dictionary(){
    const file_text = await load_text("src/assets/eng_dict.txt");
    const lines = file_text.split('\n');
    
    let rank = 0;

    for (const line of lines) {
        const fields = line.split('\t');
        if (fields.length === 2) {
            dict.insert(fields[0], [fields[1], false]);
            rank += 1;
        }
    }
    await chrome.storage.local.set({
        "nwd_dict": [dict.entries, Array.from(dict.index_map)]
    });
    return rank;
}