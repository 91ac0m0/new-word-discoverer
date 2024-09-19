import { useEffect, useState } from "react";
import { config, get_config, set_config } from "../scripts/config";


let app_config: config;
export const TranslateRange = () =>  {
  const [range, setRange] = useState<number>(30);

  useEffect(() => {
    (async () => {
      app_config = await get_config();
      setRange(app_config.show_range);
    })()
  }, [])
  
  function changeRange(event: React.ChangeEvent<HTMLInputElement>) {
    const new_range = event.target.valueAsNumber;
    (async () => {
      app_config.show_range = new_range;
      await set_config(app_config);
    })();
    set_config(app_config);
    setRange(new_range);
  };

  return (
    <div className="block items-center mt-10">
      <div className="relative">
        <div 
          className="w-28 p-1 right-2 absolute transform -top-8 bg-slate-700 text-white text-xs rounded"
          style={{ left: `${(range - 6) / 140 * 100}%` }}>
            <div>
              show range {range}%
            </div>
            <svg className="w-4 absolute text-indigo-900 right-12 h-4 top-100" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"></polygon>
            </svg>
        </div>
      </div>

      <input type="range" 
            min={0} max="100" step="5"
            value={range} onChange={changeRange}
            className="w-5/6 text-indigo-500 range range-xs range-primary"  />

      {/* <div className="mx-7 w-3/4 justify-between text-xs p-2 flex space-x-11">
          <span> </span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span> </span>
      </div> */}
     
    </div>)
}