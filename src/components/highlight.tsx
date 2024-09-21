import { createPortal } from "react-dom";
import { style } from "../scripts/config";
import React, { useState, useRef, useEffect } from 'react';
import { Bubble } from "./bubble";


export function highlight_node(node: Node, tokens: string[], highlight_style: style, dark: boolean) {
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

    let el= (<>{parts.map((part, index) =>
            tokens.includes(part.toLocaleLowerCase())? 
            (<Highlight_word key={index} part={part} highlight_style={highlight_style} dark={dark}></Highlight_word>)
            :
            part
            )}</>);
    let new_empty_element = document.createElement('span');
    node.parentElement.insertBefore(new_empty_element, node);
    return createPortal(el, new_empty_element);
}

interface Props {
    part: string;
    highlight_style: style;
    dark: boolean
}

const Highlight_word: React.FC<Props> = ({ part, highlight_style, dark }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    let style_class;
    if(highlight_style === style.shadow) {
        style_class = "bg-indigo-400";
    } else if (highlight_style === style.underline) {
        style_class = "underline decoration-indigo-400 underline-offset-2 decoration-solid decoration-2";
    } else {
        style_class = "text-indigo-400";
    }

    let dark_style = "relative";
    if (dark) {
        dark_style += " dark";
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <span className={dark_style}>
        <span className={style_class} onClick={() => setIsOpen(!isOpen)} >{part}</span>
        {isOpen && (
            <div
            ref={popupRef}
            className="z-50 absolute left-4 -button-1 mt-2 transform transition-all duration-300 ease-in-out"
            ><Bubble word={part.toLocaleLowerCase()} is_open={isOpen}></Bubble>
            </div>
        )}
        </span>
    );
};
