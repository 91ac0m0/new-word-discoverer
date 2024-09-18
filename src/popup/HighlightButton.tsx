export function HighlightButton() {

    function highlightPage() {
        (async() => {
            await chrome.runtime.sendMessage({query: 'highlight'});
        })()
    }

    return (<div className=" text-white">
            <button 
            className="w-full py-2 btn btn-outline btn-primary"
            onClick={highlightPage}>高亮</button>
        </div>)
}
