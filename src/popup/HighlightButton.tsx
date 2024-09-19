export function HighlightButton() {

    function highlightPage() {
        (async() => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab.id){
                await chrome.tabs.sendMessage(tab.id, {query: "highlight"});
            }
        })()
    }

    return (<div className=" text-white">
            <button 
            className="w-24 py-2 btn btn-outline btn-primary"
            onClick={highlightPage}>Highlight</button>
        </div>)
}
