"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { useUserStore } from "@/store/store"; // Client-side user store
import useChatStore from "../chatStore";
import { BsDot } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowDown } from "react-icons/md";

import { RxChatBubble } from "react-icons/rx";
import { RiHomeSmile2Line } from "react-icons/ri";
import { LuBriefcase } from "react-icons/lu";
import { IoMdArrowBack } from 'react-icons/io';

const Sidebar = () => {
  // const [chatUsersData, setChatUsersData] = useState<any>([]);

  const [filteredChatUsers, setFilteredChatUsers] = useState<any[]>([]);
  const { user } = useUserStore();
  const current_user_id = user?.user_id;
  const [activeFilter, setActiveFilter] = useState("All");
  const [showUnreadchats, setshowUnreadchats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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
  

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp?.seconds) return '';
  
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
  
    if (diffInHours > 24) {
      if (diffInHours <=48 ){
        return "yesterday"
      }
      else{
        const daysAgo = Math.floor(diffInHours / 24);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      }
      
    }
  
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const { chatUsersData, fetchChats, setReciver, reciver } = useChatStore();


  useEffect(() => {
    fetchChats(current_user_id);
    console.log("user data at side bar is ", chatUsersData);
  }, [current_user_id]);

  useEffect(() => {
    const filteredData = chatUsersData.filter((user: any) => {
      // Apply filters based on activeFilter
      if (activeFilter === "Hosting") {
        return user.senderId !== current_user_id ; // Only show unread chats
      }
      else if (activeFilter === "Travelling") {
        return user.senderId == current_user_id ; // Only show unread chats
      }

      return true; // For "all", show all chats
    });

    // Update the filtered state
    setFilteredChatUsers(filteredData);
    setMenuOpen(false)
  }, [activeFilter, chatUsersData, current_user_id]);

  // show unread chats if selected 
  useEffect(() => {
    const filteredUnreadChats = chatUsersData.filter((user: any) => {
      if (showUnreadchats) {
        return user.senderId !== current_user_id && !user.is_read; // Only show unread chats
      }
      return true; // For "all", show all chats
    });

    // Update the filtered state
    setFilteredChatUsers(filteredUnreadChats);
  }, [showUnreadchats, chatUsersData, current_user_id]);


  useEffect(() => {
    // Filter chatUsersData based on searchQuery
    const filteredData = chatUsersData.filter((user: any) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChatUsers(filteredData);
  }, [searchQuery, chatUsersData]);
  const router = useRouter();

  const handleClick = (data: any) => {
    console.log(data);
    setReciver(data); // Set the receiver when clicked
    // Ensure this runs client-side
    if (typeof window !== "undefined") {
      router.replace(`/chat/chatwindow/${data.userId}`); // Replace the current URL
    }
  };

  return (
    <div className="w-full h-screen md:w-[35%] p-4 px-2 flex flex-col">
      <div className="h-auto">
        <div className="flex gap-3 items-center">
        <Link href={'/'} className="text-lg font-bold flex gap-2 items-center">
          <Image src={'/logo.png'} alt='logo' width={30} height={30} className='hidden sm:block'/>
          <div
          className="hover:bg-gray-200 px-2 py-1 rounded-lg block items-center sm:hidden"
          onClick={() => typeof window !== 'undefined' ? window.history.back() : null}
        >
          <IoMdArrowBack className="text-2xl cursor-pointer rounded-full transition-colors duration-300" />
        </div>
        </Link>
          <p className="text-xl font-bold">Messages</p>
        </div>
        <div className="py-3 px-8">

       
        <div className="my-3 flex border-2 rounded-xl items-center px-1">
          <CiSearch size={22} />
          <input
            type="text"
            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
            className="w-full h-10 pl-3 bg-transparent border-0 focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="Search users"
          />
        </div>
        <ul className="flex gap-3">
          <div
            className={`py-2 px-4 min-w-16 mb-2 flex gap-2 justify-center items-center rounded-3xl font-semibold cursor-pointer ${activeFilter === "all" ? "bg-black text-white" : "border-2"
              }`}
            // onClick={() => setActiveFilter("all")}
            ref={buttonRef}
            onClick={toggleMenu}
            
          >
            <p>{activeFilter}</p> 
            <MdKeyboardArrowDown  className={` ${menuOpen? "rotate-180" : ""} transition-transform text-lg`}/>
          </div>
          <button
            className={`py-2 px-4 min-w-16 mb-2 flex justify-center items-center rounded-3xl  font-semibold border-2 ${showUnreadchats ? "bg-black text-white border-black" : ""
              }`}
            onClick={() => setshowUnreadchats(!showUnreadchats)}
          >
            Unread
          </button>
        </ul>
        </div>
      </div>

      <div className="mt-3 h-full flex flex-col gap-3 md:gap-2 overflow-y-scroll custom-scroll px-4">
        {filteredChatUsers.length > 0 ? (
          filteredChatUsers.map((data: any, index: number) => (
            <button
              className="flex gap-3 p-2 mx-1 items-center hover:bg-gray-100 rounded-lg cursor-pointer"
              key={index}
              onClick={() => handleClick(data)}
            >
              {/* User Image */}
              <div className="w-13 h-13 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-300">
                <Image
                  alt="user image"
                  src={data?.userImageURL || "/default-image.png"}
                  width={48} // Set a fixed width
                  height={48} // Set a fixed height
                  className="object-cover" // Ensures the image scales properly within its container
                />
              </div>


              {/* Message Info */}
              <div className="w-[75%] overflow-hidden">
                <div className="flex items-center justify-between flex-row">
                  <p className="font-bold md:font-medium">{data?.userName || " "}</p>
                  <p className="w-auto overflow-hidden text-nowrap text-[11px] text-xs font-normal text-gray-700">
                    {formatTimestamp(data.lastMessageTimestamp) || ""}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  {/* Message preview */}
                  <p className={`w-auto overflow-hidden text-nowrap text-sm ${data.senderId !== current_user_id && !data.is_read ? 'text-black font-bold' : ''} `}>
                    {data.lastMessage || ""}
                    {/* Display "new" badge if message is unread and not sent by current user */}

                  </p>

                  {/* Timestamp */}

                  {data.senderId !== current_user_id && !data.is_read && (
                    <span className="flex items-center text-blue-500">
                      <BsDot className="text-2xl" />
                      {/* new */}
                    </span>
                  )}

                </div>
              </div>
            </button>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </div>


      {menuOpen && (
              <div ref={menuRef} className="absolute mt-44 ml-6 min-w-72 bg-white  rounded-3xl shadow-2xl z-50 text-gray-600 p-4">
                <ul className="flex flex-col p-2 text-lg font-semibold" >
                    <li className="flex gap-4 items-center p-2 px-4 rounded-3xl hover:bg-gray-50 cursor-pointer" onClick={()=> setActiveFilter("All")} >
                    <RxChatBubble className="text-2xl" />
                      All
                    </li>
                    <li className="flex gap-4 items-center p-2 px-4 rounded-3xl hover:bg-gray-50 cursor-pointer" onClick={()=> setActiveFilter("Hosting")}>
                    <RiHomeSmile2Line className="text-2xl" />
                      Hosting
                    </li>
                    <li className="flex gap-4 items-center p-2 px-4 rounded-3xl hover:bg-gray-50 cursor-pointer" onClick={()=> setActiveFilter("Travelling")}>
                    <LuBriefcase className="text-2xl" />
                      Travelling
                    </li>
                </ul>
              </div>
            )}
    </div >
  );
};

export default Sidebar;
