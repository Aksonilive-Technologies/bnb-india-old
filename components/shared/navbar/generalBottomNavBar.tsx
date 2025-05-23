'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { TfiBookmarkAlt } from "react-icons/tfi";
import { BsChatSquare, BsHeart } from "react-icons/bs";
import { PiUserCircleLight } from "react-icons/pi";


const BottomNavBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling Down
        setIsVisible(false);
      } else {
        // Scrolling Up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <ul
      className={`fixed bottom-0 h-16 bg-white w-full flex justify-between items-center py-4 px-3 md:hidden transition-transform duration-300 text-xs text-gray-700 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
                  
                  <Link href="/profile/mybookings">
                    <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
                      <TfiBookmarkAlt className="text-2xl" />
                      <p>Bookings</p>
                    </li>
                  </Link>
                  <Link href="/chat">
                    <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
                      <BsChatSquare className="text-2xl" />
                      <p>Chats</p>
                    </li>
                  </Link>
                  <Link href="/profile/savedvillas">
                    <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
                      <BsHeart className="text-2xl" />
                      <p>WishList</p>
                    </li>
                  </Link>
                  <Link href="/profile">
                    <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
                      <PiUserCircleLight className="text-2xl" />
                      <p>Profile</p>
                    </li>
                  </Link>
                </ul>

  );
};

export default BottomNavBar;
