"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {signOut } from 'firebase/auth';
import { auth } from "@/firebase/firebaseConfig";
import { CiGlobe } from "react-icons/ci";
import { FaQuestionCircle, FaRegUser, FaSignOutAlt } from "react-icons/fa";
import { IoTicketOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GrArticle } from "react-icons/gr";
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/store";
// import { logout } from "@/firebase/firebase";
import { Logout } from "@/firebase/Auth";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useSocketStore } from "@/store/socketStore";
import {BsHeart} from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function ProfileMenu({ navbarBg = true }) {

  const [isHydrated, setIsHydrated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMode, setUserMode] = useState("Switch to hosting");
  const [modePath, setModePath] = useState("/hostpanel");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { user, setUser, getUserData, hasFetched, isLoading, setHasFetched } = useUserStore();
  const connectSocket = useSocketStore((state) => state.connectSocket);
  const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (user?.user_id) {
      connectSocket(); // Automatically uses the user from useUserStore
    }
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, user?.user_id]);

  useEffect(() => {
    // Define the async function inside useEffect
    // console.log(user);

    const fetchData = async () => {
      if (!user || !hasFetched) {
        // console.log("log at email login", user, hasFetched);

        await getUserData();
      }
    };
    fetchData();
  }, [user]); // Include getUserData in the dependency array


  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await signOut(auth);
      await Logout();
      setUser(null)
      localStorage.removeItem('user-store');
      setHasFetched(false);
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

   useEffect(() => {
    setIsHydrated(true); // Hydration flag for client-side rendering
    if (pathname.includes("/hostpanel")) {
      setUserMode("Switch to travelling")
      setModePath("/")
    } else {
      setUserMode("Switch to hosting")
      setModePath("/hostpanel")
    }
  }, []);

  if (!isHydrated) {
    return null;
  }


  return (
    <>
      {user ? (
        <div className="flex gap-3 items-center justify-between">
          <Link
            className={` font-semibold hidden lg:flex items-center border-2 border-transparent hover:border-gray-300 p-1 rounded-xl justify-end gap-1 px-2  ${navbarBg ? "text-black" : "text-white"}`}
            href={user?.isHost ? modePath : '/request'}>
            <CiGlobe size={22} />
            <p className="whitespace-nowrap text-[1rem]">{user?.isHost ? userMode : "Be a host"}</p>
          </Link>

          <div className={navbarBg ? "text-gray-600" : "text-gray-200"} ref={buttonRef}>
            <button
              className="sm:w-10 h-10 sm:rounded-full overflow-hidden sm:bg-gray-300 "
              onClick={toggleMenu}
            >
              <Image
                alt="profile image"
                src={user.profile_image ? `${user.profile_image}` : "/default_profile.png"}
                width={150}
                height={150}
                className="object-cover w-full h-full hidden sm:block"
              />
              <FaEllipsisVertical className="text-xl sm:hidden" />
            </button>

            {menuOpen && (
              <div ref={menuRef} className="absolute right-0 mt-2 mr-2 w-48 bg-white border rounded-lg shadow-lg z-50 text-gray-600">
                <ul className="flex flex-col p-2">
                  <Link href="/profile">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <FaRegUser className="mr-2" />
                      Profile
                    </li>
                  </Link>
                  <Link href="/profile/mybookings">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <IoTicketOutline className="mr-2" />
                      My Bookings
                    </li>
                  </Link>
                  <Link href="/profile/savedvillas">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <BsHeart className="mr-2" />
                      Wish List
                    </li>
                  </Link>
                  <Link href="/chat">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <IoChatbubbleEllipsesOutline className="mr-2" />
                      Chats
                    </li>
                  </Link>
                  <Link href={user?.isHost ? modePath : '/request'} className="inline-block lg:hidden">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <CiGlobe className="mr-2" />
                      {user?.isHost ? userMode : "Be a host"}
                    </li>
                  </Link>
                  <Link href="/blogs">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <GrArticle className="mr-2" />
                      Blogs
                    </li>
                  </Link>
                  <Link href="/helpandsupport">
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <FaQuestionCircle className="mr-2" />
                      Help & Support
                    </li>
                  </Link>
                  <div onClick={handleLogout}>
                    <li className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </li>
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link
          className={`p-1 border-[1px] font-semibold rounded-lg px-2 text-md ${navbarBg ? "text-gray-600 border-gray-400 " : "text-white border-gray-100 "}`}
          href="/login">
          {/* <button > */}
          Sign in
          {/* </button> */}
        </Link>
      )}
    </>
  );
}
