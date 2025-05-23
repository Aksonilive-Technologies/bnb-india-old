"use client";

import { useState, useRef, useEffect } from "react";

interface ReadMoreProps {
  id: string;
  htmlContent?: string;
}

export default function ReadMoreComponent({ id, htmlContent = "" }: ReadMoreProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    setShowButton(contentRef.current.scrollHeight > 224);
  }, [htmlContent]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  if (!htmlContent.trim()) {
    return (
      <p id={id} className="text-gray-500 italic">
        No description available.
      </p>
    );
  }

  return (
    <div>
      {/* Truncated Content */}
      <div id={id} className="max-w-none relative max-h-60 sm:max-h-56 overflow-hidden">
        <div ref={contentRef} className="overflow-hidden text-[1rem] sm:text-lg" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      {/* Show More Button */}
      {showButton && (
        <button
          className="text-lg flex items-center gap-1 group cursor-pointer my-3"
          onClick={() => setIsPopupOpen(true)}
          aria-controls={id}
        >
          <p className="underline font-semibold">
          Show more 
          </p>
          <p className="text-4xl font-thin leading-none group-hover:translate-x-1 duration-300">&#8250;</p>
        </button>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div ref={popupRef} className="bg-white w-[90vw] md:w-[70vw] lg:w-[50vw] h-[80vh] sm:h-[90vh] flex justify-center py-10 rounded-xl sm:rounded-3xl shadow-2xl relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-3 text-gray-500 text-3xl font-bold"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-scroll">
              <div className="p-6 md:p-10 pt-6">
                <p className="text-2xl font-bold">About This Stay</p>
                <div className="w-full mt-4 text-[1rem] sm:text-lg" dangerouslySetInnerHTML={{ __html: htmlContent }} />

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
