"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import for programmatic navigation
import { FaSearch } from "react-icons/fa";

import NavBarCategories from "./blogNavbarCategories";
import PlaceholderProfileMenu from "./placeHolderProfileMenu";

const ProfileMenu = dynamic(() => import("./ProfileMenu"), {
  ssr: false,
  loading: () => <PlaceholderProfileMenu />,
});

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize the router

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Navigate to the explore page with the search query
      router.push(`/blogs/explore?search=${searchQuery}`);
    }
  };

  return (
    <nav className="sticky bg-white top-0 z-50">
      <div className="bg-white shadow-sm py-2 px-1 sm:px-4 flex justify-center md:justify-between items-start z-50 sticky top-0">
        <Link
          href={"/"}
          className="hidden md:flex text-lg mt-2 font-bold  gap-2 items-center"
        >
          <Image src={"/logo.png"} alt="logo" width={30} height={30} />
          <p className="hidden sm:block pt-3 pb-0">bnbIndia</p>
        </Link>
        <div className="block min-w-[86%] md:min-w-96">
          <div className="flex rounded-full drop-shadow-sm border p-1 gap-2 items-center justify-between overflow-hidden">
            <input
              type="text"
              name="blogSearch"
              id="blogSearch"
              className="w-[86%] h-10 rounded-full px-3 border border-gray-100 focus:outline-none  focus:ring-gray-300 focus:border-gray-200"
              placeholder="Search Blogs"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Handle Enter key
            />
            <Link
              href={{
                pathname: "/blogs/explore",
                query: { search: searchQuery },
              }}
              className="cursor-pointer h-full my-auto p-3 flex items-center justify-center rounded-full gap-2 red-gradient"
            >
              <FaSearch className="text-white w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="mt-2 hidden md:block">
          <ProfileMenu />
        </div>
      </div>

      <div className="flex justify-center z-[-1] items-center bg-white drop-shadow-sm px-10 md:gap-6">
        <NavBarCategories />
      </div>
    </nav>
  );
}
