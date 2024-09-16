import React, { useState, useRef, useEffect } from 'react';

interface PopupButtonProps {
  part: string;
}

export const Highlight_color: React.FC<PopupButtonProps> = ({ part }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

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
      <span className="bg-orange-200" onClick={() => setIsOpen(!isOpen)} >{part}</span>
      {isOpen && (
        <div
          ref={popupRef}
          className="z-50 absolute top-0 left-0 mt-2 transform transition-all duration-300 ease-in-out"
        ><Bubble></Bubble>
        </div>
      )}
    </span>
  );
};


const Bubble = () => {

  return     (
  <div className="box-content w-64 h-32 max-auto flex shadow-2xl">
      <div className="flex-grow-3 w-3/4 rounded-l-xl p-3 border-y-2 border-l-2 border-slate-600 backdrop-blur-md bg-white bg-opacity-60">
          <div className="text-xl text-black font-bold">origin</div>
          <div className="text-slate-500 text-base">n. 起源，源頭;起因</div>
          <div className="text-slate-500 text-base">n. 出生地</div>
      </div>
      <div className="flex-grow-1 w-1/4">
          <div className="flex flex-col h-full">
              <div className="h-1/2 rounded-tr-xl border-2 border-slate-600 flex items-center justify-center backdrop-blur-md bg-white bg-opacity-60 hover:bg-opacity-70">
              </div>
              <div className="h-1/2 rounded-br-xl border-x-2 border-b-2 border-slate-600 flex items-center justify-center backdrop-blur-md bg-white bg-opacity-60 hover:bg-opacity-70">
              </div>
          </div>
      </div>
  </div>)
}