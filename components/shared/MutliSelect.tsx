import React, { useState } from "react";
import Select from "react-select";
import { AiOutlineClose } from "react-icons/ai";

interface MultiSelectTagsProps {
    tagsOptions: string[];
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
    tagsOptions,
    selectedTags,
    setSelectedTags,
}) => {
    // Convert tagsOptions into the format required by react-select

    const availableTags = tagsOptions.filter((tag: string) => !selectedTags.includes(tag));

    const options = availableTags.map((tag) => ({ value: tag, label: `#${tag}` }));

    // State to track available options (options not currently selected)
    const [availableOptions, setAvailableOptions] = useState<any[]>(options);

    // Handle adding new tags
    const handleChange = (selectedOptions: any) => {
        const newTags = selectedOptions.map((option: any) => option.value);
        setSelectedTags((prev) => [...prev, ...newTags]);
        setAvailableOptions((prev) => prev.filter((opt) => !newTags.includes(opt.value)));
    };

    // Handle removing a tag
    const handleRemoveTag = (tag: string) => {
        // Remove the tag from selectedTags
        setSelectedTags((prev) => prev.filter((t) => t !== tag));

        // Add the removed tag back to availableOptions
        setAvailableOptions((prev) => [
            ...prev,
            { value: tag, label: `#${tag}` },
        ]);
    };

    return (
        <div className="relative w-full">
            {/* Display selected tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md flex items-center space-x-2 border border-gray-300 shadow-sm"
                    >
                        <span className="text-sm font-medium">{`#${tag}`}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-sm text-gray-800 rounded-full p-1 hover:bg-gray-300 transition-colors"
                        >
                            <AiOutlineClose size={14} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Multi-select dropdown */}
            <Select
                isMulti
                options={availableOptions}
                onChange={handleChange}
                value={[]} // Clear the input after selection
                placeholder="Select tags..."
                className="basic-single"
                classNamePrefix="select"
                styles={{
                    control: (provided) => ({
                        ...provided,
                        borderColor: "#d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "none",
                        "&:hover": {
                            borderColor: "#ec4899",
                        },
                    }),
                    menu: (provided) => ({
                        ...provided,
                        borderRadius: "0.375rem",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#f3f4f6" : "#ffffff",
                        color: "#000000",
                        fontSize: "0.875rem",
                        "&:hover": {
                            backgroundColor: "#f3f4f6",
                        },
                    }),
                }}
            />
        </div>
    );
};

export default MultiSelectTags;