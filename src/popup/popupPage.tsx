import { HighlightButton } from "./HighlightButton";
import { LanguageSelector } from "./LangSelector";
import { TranslateRange } from "./TranslateRange";
import { ThemeController } from "./ThemeController";
import { HighlightSelector } from "./HighlightSelector";
import { SwitcherAlways, SwitcherWhiteList, SwitcherBlackList } from "./Switchers";

export default function Page() {
    return (
        <div className="w-80 py-6 px-4 text-center text-surface shadow-secondary-1 bg-orange-100 dark:bg-gray-900 dark:text:white">
            <div className="flex flex-row space-x-4 m-4">
                <HighlightSelector></HighlightSelector>
                <ThemeController></ThemeController>
            </div>
            <div className="flex flex-row space-x-4 m-4">
                <LanguageSelector></LanguageSelector>
                <HighlightButton></HighlightButton>
            </div>
            <div>
                <SwitcherAlways></SwitcherAlways>
                <SwitcherWhiteList></SwitcherWhiteList>
                <SwitcherBlackList></SwitcherBlackList>
            </div>
            <TranslateRange></TranslateRange>
        </div>

    )
}