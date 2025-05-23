'use client';
import React, { useRef, useEffect, useState } from 'react';

interface MessageTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEnterPress: () => void; // New prop for handling Enter key press
}

const MessageTextArea: React.FC<MessageTextAreaProps> = ({ value, onChange, onEnterPress }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState<number>(0);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto'; // Reset the height
    const maxRows = 6;
    const rowHeight = 1.25; // Assuming 1.25em is the height of one row

    // Calculate the height based on the scrollHeight
    const newHeight = Math.min(textarea.scrollHeight, maxRows * rowHeight * 16); // 16 is the default font-size in pixels
    textarea.style.height = `${newHeight}px`;
  };

  const handleInput = () => {
    if (textareaRef.current) {
      setCharCount(textareaRef.current.value.length);
      adjustTextareaHeight(textareaRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent new line on Enter
      onEnterPress(); // Trigger send message function
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      className="w-full p-2 border rounded-xl resize-none overflow-auto display-no-scroll"
      placeholder="Write your message"
      rows={1}
      value={value} // Set value from props
      onChange={(e) => {
        onChange(e); // Call onChange from props
        handleInput(); // Adjust height and character count
      }}
      onKeyDown={handleKeyDown} // Listen for Enter key press
      style={{ maxHeight: 'calc(1.25em * 6)' }}
    />
  );
};

export default MessageTextArea;
