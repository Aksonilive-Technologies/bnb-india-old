"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getAllCategories } from "@/actions/listing/listing.action";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Icons for the scroll buttons

export default function NavBarCategories() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<string | null>("");
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);

  // Fetch amenities on component mount
  useLayoutEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // Start loading
  
      try {
        const data = await getAllCategories();
        console.log({ data });
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false); // Stop loading only after fetching
      }
    };

    const checkOverflow = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowScrollButtons(container.scrollWidth > container.clientWidth);
      }
    };
  
    fetchCategories();

    checkOverflow(); // Check on component mount

    // Check again on window resize
    typeof window !== "undefined"
      ? window.addEventListener("resize", checkOverflow)
      : null;

    return () => {
      typeof window !== "undefined"
        ? window.removeEventListener("resize", checkOverflow)
        : null;
    };
  }, []);

  const updateCategoryFromUrl = () => {
    const currentUrl = new URL(
      typeof window !== "undefined" ? window.location.href : "/",
    );
    const query = new URLSearchParams(currentUrl.search);
    const categoryFromUrl = query.get("category");
    setCurrentCategory(categoryFromUrl);
  };

  useEffect(() => {
    updateCategoryFromUrl();
  }, []);

  // Function to handle category click
  const handleClick = (code: string) => {
    const currentUrl = new URL(
      typeof window !== "undefined" ? window.location.href : "/",
    );
    const query = new URLSearchParams(currentUrl.search);

    if (currentCategory === code) {
      query.set("category", "All");
      code = "All";
    } else {
      query.set("category", code);
    }

    // Manually construct the new URL
    const newUrl = `${currentUrl.pathname}?${query.toString()}`;
    router.push(newUrl);

    setCurrentCategory(code);
  };

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-[95vw] md:max-w-[85vw] flex items-center py-1 relative">
      {showScrollButtons && (
        <button
          onClick={scrollLeft}
          className=" z-10 bg-white p-3 hover:bg-gray-200 rounded-full shadow-lg focus:outline-none"
        >
          <AiOutlineLeft size={16} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-8 h-16 overflow-x-auto display-no-scroll"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 justify-center"
              >
                <div className="w-10 h-10 py-2 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="h-2 w-12 bg-gray-300 animate-pulse rounded-2xl"></div>
              </div>
            ))
          : categories.map((d, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(d.category_code)}
                className={`flex px-2 flex-col justify-center items-center cursor-pointer gap-2 hover:opacity-100 h-full border-2 border-transparent hover:border-b-gray-600 ${
                  currentCategory === d.category_code
                    ? "opacity-100 border-b-gray-600"
                    : "opacity-75"
                }`}
              >
                <Image
                  src={d.category_image}
                  alt="logo"
                  width={20}
                  height={20}
                  className="w-8 h-8" // Responsive image sizing
                />
                <p className="text-sm font-medium text-nowrap">{d.category_name}</p>
              </button>
            ))}
      </div>

      {showScrollButtons && (
        <button
          onClick={scrollRight}
          className=" z-10 bg-white p-3 hover:bg-gray-200 rounded-full shadow-lg focus:outline-none"
        >
          <AiOutlineRight size={16} />
        </button>
      )}
    </div>
  );
}

// const categories = [
//   {
//     id: '01',
//     name: 'Pools',
//     code: 'Pool',
//     icon: '/categories/pool.png',
//   }
// ];
