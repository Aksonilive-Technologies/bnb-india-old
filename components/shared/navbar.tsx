"use client";

import Image from "next/image"
import React, { useState } from 'react';
// import "@/style/navbar.css"
import {UserRound  } from "lucide-react";
import { onAuthStateChanged, User} from 'firebase/auth';
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";


export default function Navbar(){
  // const [show, setShow] = useState<boolean>(false);
  const [navbar, setNavbar] = useState(false);

  const defaultImage = "https://p7.hiclipart.com/preview/355/848/997/computer-icons-user-profile-google-account-photos-icon-account.jpg"

  const changeNavrbarColor = () =>{
    if (typeof window !== 'undefined') {
            if(window.scrollY >= 160){
                setNavbar(true);
            }
            else{
                setNavbar(false);

            }
      }
  }

  const opendropdown = () => {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("hidden");
    }
};



  React.useEffect(() => {
    if (typeof window !== 'undefined') {
          window.addEventListener("scroll", changeNavrbarColor);
          return () => {
              window.removeEventListener('scroll', changeNavrbarColor);
            };
          }
  }, []);


  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
    return(
        <>


                <nav className={navbar?"flex justify-between w-full px-8 py-1 bg-slate-100 drop-shadow-lg":"flex justify-between w-full px-8 py-1  drop-shadow-lg"}>
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                  {navbar?<Image
                            src="/logo.png"
                            alt="bg-image"
                            width={70}
                            height={70}
                            className=" opacity-60"
                        />:<Image
                        src="/logo_white.png"
                        alt="bg-image"
                        width={70}
                        height={70}
                        className=" opacity-60"
                    />}
                
        <span className={navbar?"self-center text-black text-2xl font-semibold whitespace-nowrap dark:text-white":"self-center text-white text-2xl font-semibold whitespace-nowrap dark:text-white"}>Pinestays</span>
    </a>
    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
    
    <div>{user?.uid}</div>
    <button type="button" className="lex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" onClick={opendropdown}>
            <span className="sr-only">Open user menu</span>
            <div className="relative overflow-hidden h-8 w-8 rounded-full">
            {user ? (
        <Image src={user.photoURL || defaultImage} 
            alt="User Profile" 
            width={80}
            height={80}
            className="object-contain w-full h-full"/>
      ) : (
        <UserRound size={28} color="#ffffff" strokeWidth={1.25} />
      )}
            </div>
        </button>
        {/* Dropdown starts */}
        <div className="z-50 hidden my-4 absolute top-16 right-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
          <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        </div>
        <ul className="py-1" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</a>
          </li>
        </ul>
        <ul className="py-1" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Booking</a>
          </li>
          <li>
            <a href="#" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Wishlist</a>
          </li>
        </ul>
        <ul className="py-1" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Help Center</a>
          </li>
          <button onClick={async () =>{await signOut(auth);}}>
            <a href="#" className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Log Out</a>
          </button>
        </ul>
      </div>

        </div>
        {/* dropdown ends */}

</nav>



        </>



    )
}