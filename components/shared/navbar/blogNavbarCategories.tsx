'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'; // Icons for the scroll buttons

export default function NavBarCategories() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<string | null>('');
  const [showScrollButtons, setShowScrollButtons] = useState(false); // State to control visibility of scroll buttons
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

  // Function to update the category from URL query
  const updateCategoryFromUrl = () => {
    const currentUrl = new URL(typeof window !== 'undefined' ? window.location.href : '/');
    const query = new URLSearchParams(currentUrl.search);
    const categoryFromUrl = query.get('category');
    setCurrentCategory(categoryFromUrl); // Update state with the category from URL
  };

  // This will run whenever the component mounts and also when the route changes
  useEffect(() => {
    updateCategoryFromUrl(); // Run initially to set the category from the URL

    // Check if content overflows the container
    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowScrollButtons(container.scrollWidth > container.clientWidth);
      }
    };

    checkOverflow(); // Check on component mount

    // Check again on window resize
    typeof window !== 'undefined' ? window.addEventListener('resize', checkOverflow): null;

    return () => {
      typeof window !== 'undefined' ? window.removeEventListener('resize', checkOverflow): null;
    };
  }, []);

  // Function to handle category click
  const handleClick = (code: string) => {
    const currentUrl = new URL(typeof window !== 'undefined' ? window.location.href : '/');
    const query = new URLSearchParams(currentUrl.search);

    if (currentCategory === code) {
      query.set('category', 'All');
      code = "All"
    }
    else {
      query.set('category', code);

    }
    if (currentUrl.pathname !== '/blogs/explore') {
      currentUrl.pathname = '/blogs/explore';
    }

    // Manually construct the new URL
    const newUrl = `${currentUrl.pathname}?${query.toString()}`;

    // Push the new URL to the router
    router.push(newUrl);

    // Update the state manually after router.push to reflect the new category in real-time
    setCurrentCategory(code);
  };

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[95vw] z-[-1] md:max-w-[85vw] flex items-center h-10 relative">
      {showScrollButtons && (
        <button
          onClick={scrollLeft}
          className=" z-10 bg-white p-3 hover:bg-gray-200 rounded-full shadow-lg focus:outline-none hidden sm:block"
        >
          <AiOutlineLeft size={16} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-6 h-full overflow-x-auto display-no-scroll"
      >
        {categories.map((d, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(d.code)}
            className={`flex px-2 flex-col justify-center items-center cursor-pointer gap-2 hover:opacity-100 h-full border-2 border-transparent hover:border-b-gray-600 ${currentCategory === d.code
              ? 'opacity-100 border-b-gray-600'
              : 'opacity-75'
              }`}
          >
            <p className="text-sm font-medium">{d.name}</p>
          </button>
        ))}
      </div>

      {showScrollButtons && (
        <button
          onClick={scrollRight}
          className=" z-10 sm:bg-white sm:p-3 hover:bg-gray-200 rounded-full sm:shadow-lg focus:outline-none "
        >
          <AiOutlineRight size={16} />
        </button>
      )}
    </div>
  );
}

const categories = [
  {
    id: '01',
    name: '#bnbhelp',
    code: 'bnbhelp'
  },
  {
    id: '02',
    name: '#nature',
    code: 'nature'
  },
  {
    id: '03',
    name: '#growth',
    code: 'growth'
  },
  {
    id: '04',
    name: '#experience',
    code: 'experience'
  },
  {
    id: '05',
    name: '#stay',
    code: 'stay'
  },
  {
    id: '06',
    name: '#adventure',
    code: 'adventure'
  },
  {
    id: '07',
    name: '#help',
    code: 'help'
  },
];
