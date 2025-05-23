"use client"

import React, { useEffect, useState } from 'react';
import MultiSelectTags from '@/components/shared/MutliSelect';

const LanguageSelection = ({ user, updateduser, setUpdatedUser, input, setInput, handleSave }: any) => {

    const tagsOptions = ["English", "Hindi", "Spanish", "French", "German"];
    const [selectedTags, setSelectedTags] = useState<string[]>(updateduser.language || []);
    const availableTags = tagsOptions.filter(tag => !selectedTags.includes(tag));
    // Update the updateduser state when selectedTags changes
    useEffect(() => {
        setUpdatedUser((prev: any) => ({
            ...prev,
            language: selectedTags,
        }));
    }, [selectedTags]);

    return (
        <div className="w-full bg-white rounded ">
            <div className="">
                <div className="flex justify-between items-center">
                    <div className="text-gray-600 text-lg font-semibold">Languages Spoken</div>
                    <button
                        onClick={() => { input === 'languages' ? setInput('') : setInput('languages'); }}
                        className="text-pink-500 font-medium hover:text-pink-700 transition-colors duration-300"
                    >
                        {input === 'languages' ? 'Close' : 'Edit'}
                    </button>
                </div>
            </div>
            {input === 'languages' ? (
                <div className="mt-1">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold ">Languages</label>
                            <MultiSelectTags
                                tagsOptions={tagsOptions}
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            className="mt-5 px-6 py-2 rounded-md red-gradient text-white font-bold "
                            onClick={async () => {
                                // handleSave(updateduser);

                                console.log(updateduser, user);

                                handleSave();
                                setInput('');
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-2">
                    {selectedTags && selectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map((lang: any) => (
                                <span
                                    key={lang}
                                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm font-medium border border-gray-400 shadow-sm"
                                >
                                    #{lang}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">No languages selected</p>
                    )}
                </div>

            )}
        </div>
    );
};

export default LanguageSelection;
