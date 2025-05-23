"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BsCalendar, BsChatSquare } from "react-icons/bs";
import { LuMapPinHouse } from "react-icons/lu";
import { RxDashboard, RxHamburgerMenu } from "react-icons/rx";

const BottomNavBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY); // Show navbar when scrolling up
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative">
      {/* Bottom Navbar */}
      <ul
        className={`fixed bottom-0 h-16 bg-white w-full flex justify-between items-center py-4 px-4 md:hidden transition-transform duration-300 text-xs text-gray-700 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link href="/hostpanel">
          <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
            <RxDashboard className="text-2xl" />
            <p>Dashboard</p>
          </li>
        </Link>
        <Link href="/hostpanel/listings">
          <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
            <LuMapPinHouse className="text-2xl" />
            <p>My Listings</p>
          </li>
        </Link>
        <Link href="/hostpanel/Calender">
          <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
            <BsCalendar className="text-2xl" />
            <p>Calendar</p>
          </li>
        </Link>
        <Link href="/chat">
          <li className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer">
            <BsChatSquare className="text-2xl" />
            <p>Chats</p>
          </li>
        </Link>

        {/* Menu Button */}
        <li
          className="flex flex-col items-center gap-1 p-1 justify-center cursor-pointer relative"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <RxHamburgerMenu className="text-2xl" />
          <p>Menu</p>
        </li>
      </ul>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={dropdownRef}
          className="fixed bottom-20 right-4 w-56 bg-white border border-gray-300 rounded-lg shadow-2xl z-50"
        >
          <Link
            href="/hostpanel/mybookings"
            className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Reservations
          </Link>
          <Link
            href="/hostpanel/analytics"
            className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Insights
          </Link>
          <Link
            href="/hostpanel/listings/create"
            className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Create a New Listing
          </Link>
          <Link
            href="/hostpanel/bankDetails"
            className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Bank Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default BottomNavBar;
