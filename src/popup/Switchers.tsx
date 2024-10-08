import { useEffect, useState } from 'react'
import { config, get_config, set_config } from '../scripts/config';

let app_config: config;
let hostname: string;

export const SwitcherWhiteList = () => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    (async () => {
      app_config = await get_config();
      const tabs = await chrome.tabs.query({currentWindow: true, active: true});
      const url = new URL(tabs[0].url!)
      hostname = url.hostname;
      setIsChecked(app_config.white_list.includes(hostname));
    })()
  }, [])

  function handleCheckboxChange() {
    const idx = app_config.white_list.indexOf(hostname, 0);
    if(idx >= 0) {
      app_config.white_list.splice(idx, 1);
    } else {
      app_config.white_list.push(hostname);
    }
    (async () => {
      set_config(app_config);
    })();
    setIsChecked(!isChecked)
  }

  return (
    <div className="px-1 py-1.5 w-full flex items-center">
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box block h-4 w-7 rounded-full ${
              isChecked ? 'dark:bg-indigo-400 bg-primary' : 'dark:bg-slate-700 bg-slate-400'
            }`}
          ></div>
          <div
            className={`absolute left-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white transition ${
              isChecked ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
      <span className="dark:text-white inline-flex ml-3">Always enable on this site</span>
      </div>
  )
}

export const SwitcherBlackList = () => {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    (async () => {
      app_config = await get_config();
      const tabs = await chrome.tabs.query({currentWindow: true, active: true});
      const url = new URL(tabs[0].url!)
      hostname = url.hostname;
      setIsChecked(app_config.black_list.includes(hostname));
    })()
  }, [])

  function handleCheckboxChange() {
    const idx = app_config.black_list.indexOf(hostname, 0);
    if(idx >= 0) {
      app_config.black_list.splice(idx, 1);
    } else {
      app_config.black_list.push(hostname);
    }
    (async () => {
      set_config(app_config);
    })();
    setIsChecked(!isChecked)
  }

  return (
    <div className="px-1 py-1.5 w-full flex items-center">
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box block h-4 w-7 rounded-full ${
              isChecked ? 'dark:bg-indigo-400 bg-primary' : 'dark:bg-slate-700 bg-slate-400'
            }`}
          ></div>
          <div
            className={`absolute left-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white transition ${
              isChecked ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
      <span className="dark:text-white inline-flex ml-3">Disable on this site</span>
      </div>
  )
}

export const SwitcherAlways = () => {
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    (async () => {
      app_config = await get_config();
      setIsChecked(app_config.is_enabled);
    })()
  }, [])

  function handleCheckboxChange() {
    app_config.is_enabled = !app_config.is_enabled;
    (async () => {
      set_config(app_config);
    })();
    setIsChecked(!isChecked)
  }


  return (
    <div className="px-1 py-1.5 w-full flex items-center">
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box block h-4 w-7 rounded-full ${
              isChecked ? 'dark:bg-indigo-400 bg-primary' : 'dark:bg-slate-700 bg-slate-400'
            }`}
          ></div>
          <div
            className={`absolute left-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white transition ${
              isChecked ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
      <span className="dark:text-white inline-flex ml-3">Enable on all sites</span>
      </div>
  )
}