import { createPortal } from "react-dom";
import { style } from "../scripts/config";
import React, { useState, useRef, useEffect } from 'react';
import { Bubble } from "./bubble";


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

    let el= (<>{parts.map((part, index) =>
            tokens.includes(part.toLocaleLowerCase())? 
            (<Highlight_word key={index} part={part} style={highlight_style}></Highlight_word>)
            :
            part
            )}</>);
    let new_empty_element = document.createElement('span');
    node.parentElement.insertBefore(new_empty_element, node);
    return createPortal(el, new_empty_element);
}

interface PopupButtonProps {
    part: string;
    style: style;
}

const Highlight_word: React.FC<PopupButtonProps> = ({ part, style }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    let style_class;
    if(style.background) {
        style_class = "bg-orange-200";
    } else if (style.underline) {
        style_class = "underline decoration-orange-100";
    } else {
        style_class = "text-amber-500";
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
        <span className="relative">
        <span className={style_class} onClick={() => setIsOpen(!isOpen)} >{part}</span>
        {isOpen && (
            <div
            ref={popupRef}
            className="z-50 absolute -left-4 -button-2 mt-2 transform transition-all duration-300 ease-in-out"
            ><Bubble word={part.toLocaleLowerCase()} is_open={isOpen}></Bubble>
            </div>
        )}
        </span>
    );
};
