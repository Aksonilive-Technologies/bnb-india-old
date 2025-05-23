"use client"
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';

import PlaceholderProfileMenu from './placeHolderProfileMenu';
import { useEffect, useRef, useState } from "react";
const ProfileMenu = dynamic(() => import('./ProfileMenu'), {
  ssr: false,
  loading: () => <PlaceholderProfileMenu />,
});


export default function Navbar() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };



  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href={'/'} className="text-lg font-bold flex gap-2 items-center">
            <Image src={'/logo.png'} alt='logo' width={30} height={30} />
            <p className={`pt-3 pb-0 text-xl text-black`}>bnbIndia</p>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/hostpanel" className="block text-gray-700 hover:text-black hover:bg-gray-100 py-1 px-4 rounded-full transition duration-300">
              Dashboard
            </Link>
            <Link href="/hostpanel/listings" className="block text-gray-700 hover:text-black hover:bg-gray-100 py-1 px-4 rounded-full transition duration-300">
              My listings
            </Link>
            <Link href="/hostpanel/Calender" className="block text-gray-700 hover:text-black hover:bg-gray-100 py-1 px-4 rounded-full transition duration-300">
              Calendar
            </Link>
            <Link href="/chat" className="block text-gray-700 hover:text-black hover:bg-gray-100 py-1 px-4 rounded-full transition duration-300">
              Chats
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`block text-gray-700 hover:text-black hover:bg-gray-100 py-1 px-4 rounded-full transition duration-300 border border-black ${isMenuOpen ? "font-bold" : ""
                  }`}
              >
                Menu
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link
                    href="/hostpanel/mybookings"
                    className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
                    onClick={closeMenu}
                  >
                    Reservations
                  </Link>
                  <Link
                    href="/hostpanel/analytics"
                    className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
                    onClick={closeMenu}
                  >
                    Insights
                  </Link>
                  <Link
                    href="/hostpanel/listings/create"
                    className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
                    onClick={closeMenu}
                  >
                    Create a New Listing
                  </Link>
                  <Link
                    href="/hostpanel/bankDetails"
                    className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 transition duration-300"
                    onClick={closeMenu}
                  >
                    Bank Details
                  </Link>
                </div>
              )}
            </div>

          </div>
          <div className="flex items-center space-x-2 px-2 py-1">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
