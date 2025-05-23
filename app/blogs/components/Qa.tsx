'use client';  // Ensure this is present for client-side component

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const CollapsibleQA = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-300 hover:bg-gray-100 rounded-lg mb-4 shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-3  transition-colors $`}
            >
                <h4 className="text-md text-left font-semibold text-gray-800">{question}</h4>
                {isOpen ? <FiChevronUp className="text-gray-700" /> : <FiChevronDown className="text-gray-700" />}
            </button>
            <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px]' : 'max-h-0'}`}
            >
                <div className="px-4 py-3">
                    <p className="text-gray-700">{answer}</p>
                </div>
            </div>
        </div>
    );
};

export default CollapsibleQA;
