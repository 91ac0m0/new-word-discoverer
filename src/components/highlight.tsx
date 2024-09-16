import { createPortal } from "react-dom";
import { style } from "../scripts/config";
import {Highlight_color} from "./bubble"
// TODO insert before element

export function highlight_node(node: Node, tokens: string[], highlight_style: style) {
    const parent_node = node.parentElement;
    if (!parent_node || !(parent_node instanceof HTMLElement )) {
        return null;
    }

    const originalText = node.textContent;
    if (! originalText) {
        return null;
    }

    let highlightedText = originalText;

    const regex = new RegExp(`(${tokens.join('|')})`, 'gi');

    const parts = highlightedText
        .split(regex)
        .filter(part => part !== '');

    let el;
    if (highlight_style.underline) {
        console.log("underline");
        el = (<>{parts.map((part, index) =>
            tokens.includes(part.toLocaleLowerCase())? 
            (<Highlight_underline key={index} part={part}></Highlight_underline>)
            :
            part
            )}</>);
    } else if (highlight_style.background) {
        console.log("background");
        el = (<>{parts.map((part, index) =>
            tokens.includes(part.toLocaleLowerCase())? 
            (<Highlight_background key={index} part={part}></Highlight_background>)
            :
            part
            )}</>);
    } else {
        console.log("color");
        el = (<>{parts.map((part, index) =>
            tokens.includes(part.toLocaleLowerCase())? 
            (<Highlight_color key={index} part={part}></Highlight_color>)
            :
            part
            )}</>);
    }

    let new_empty_element = document.createElement('span');
    node.parentElement.insertBefore(new_empty_element, node);
    return createPortal(el, new_empty_element);
}

function Highlight_background({part}: {part:string}) {
    return <span className="bg-orange-200">{part}</span>
}


// function Highlight_color({part}: {part:string}) {
//     return <span className="text-orange-300">{part}</span>

// }

function Highlight_underline({part}: {part:string}) {
    return <span className="underline decoration-orange-100">{part}</span>
}
