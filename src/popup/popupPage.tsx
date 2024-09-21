import { HighlightButton } from "./HighlightButton";
import { LanguageSelector } from "./LangSelector";
import { TranslateRange } from "./TranslateRange";
import { HighlightSelector } from "./HighlightSelector";
import { SwitcherAlways, SwitcherWhiteList, SwitcherBlackList } from "./Switchers";
import { ThemeController } from "./ThemeController";

export default function Page() {
    return (
        <div className="w-80 py-6 px-4 text-center text-surface shadow-secondary-1 bg-gray-100 dark:bg-gray-900 dark:text:white font-sans">
            <div className="flex flex-row space-x-4 m-4">
                <HighlightSelector></HighlightSelector>
                <HighlightButton></HighlightButton>
            </div>
            <div className="flex flex-row space-x-4 m-4">
                <LanguageSelector></LanguageSelector>
                <ThemeController></ThemeController>
            </div>
            <div className="m-4 text-sm subpixel-antialiased font-sans font-medium">
                <SwitcherAlways></SwitcherAlways>
                <SwitcherWhiteList></SwitcherWhiteList>
                <SwitcherBlackList></SwitcherBlackList>
            </div>
            <TranslateRange></TranslateRange>
        </div>

    )
}