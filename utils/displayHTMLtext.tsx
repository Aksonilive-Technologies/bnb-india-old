'use client';

import React, { useState, useEffect } from 'react';

interface DisplayTextProps {
  content: string | undefined;
}

const DisplayHTMLText: React.FC<DisplayTextProps> = ({ content }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [displayedContent, setDisplayedContent] = useState<string>('');
  const [isTruncated, setIsTruncated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && content) {
      const parsedContent = parseContent(content);
      const truncatedContent = getTruncatedContent(parsedContent);
      setDisplayedContent(truncatedContent);
    }
  }, [content, expanded]);

  const parseContent = (html: string) => {
    if (typeof window === 'undefined') {
      return html; // Return unprocessed HTML during SSR
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('h1, h2, p, span, strong, div, a, ul, ol, li'); // Include other text elements you want to style

    elements.forEach(element => {
      switch (element.tagName.toLowerCase()) {
        case 'strong':
          element.classList.add('font-semibold');
          break;
        case 'h1':
          element.classList.add('-m-1', 'mt-2');
          break;
        case 'p':
        case 'span':
        case 'div':
        case 'li':
          element.classList.add('m-0');
          break;
        case 'ul':
          element.classList.add('list-disc', 'pl-5');
          break;
        case 'ol':
          element.classList.add('list-decimal', 'pl-5');
          break;
        case 'a':
          element.classList.add('text-blue-500', 'hover:underline'); // Example: Styling links
          break;
        default:
          break;
      }
    });

    return doc.body.innerHTML;
  };

  const getTruncatedContent = (html: string) => {
    if (typeof window === 'undefined') {
      return html; // Return unprocessed HTML during SSR
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.querySelectorAll('h1, h2, p, span, div, a'); // Include other text elements you want to count lines for

    let lineCount = 0;
    let truncatedHtml = '';
    elements.forEach(element => {
      if (lineCount < 8) {
        truncatedHtml += element.outerHTML;
        lineCount += element.textContent?.split(/\r\n|\r|\n/).length || 0;
      }
    });

    if (lineCount >= 8) {
      setIsTruncated(true);
      return truncatedHtml + '...';
    } else {
      setIsTruncated(false);
      return html;
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      <div
        className={`prose prose-lg leading-tight text-[16px] w-full `}
        dangerouslySetInnerHTML={{ __html: expanded ? parseContent(content as string) : displayedContent }}
      />
      {isTruncated && (
        <button
          onClick={toggleExpand}
          className='text-violet-400 ml-2'
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default DisplayHTMLText;
