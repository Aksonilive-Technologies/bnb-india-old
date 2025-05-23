"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import dynamic from 'next/dynamic';

import PlaceholderProfileMenu from './placeHolderProfileMenu';

const ProfileMenu = dynamic(() => import('./ProfileMenu'), {
  ssr: false,
  loading: () => <PlaceholderProfileMenu />,
});

export default function Navbar() {
  // const buttonRef = useRef<HTMLDivElement>(null);
  const [navbarBg, setNavbarBg] = useState(false);


  const changeNavrbarColor = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY >= 160) {
        setNavbarBg(true);
      } else {
        setNavbarBg(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", changeNavrbarColor);
      return () => {
        window.removeEventListener("scroll", changeNavrbarColor);
      };
    }
  }, []);

  return (
    <nav
      className={`${navbarBg ? "bg-white shadow-sm" : "bg-transparent"} py-2 px-4 flex justify-between items-center z-50`}
    >
      <Link href={"/"} className="text-lg font-bold flex gap-2 items-center">
        <Image
          src={navbarBg ? "/logo.png" : "/logo_white.png"}
          alt="logo"
          width={30}
          height={30}
        />
        <p
          className={`pt-3 pb-0 text-xl ${navbarBg ? "text-black" : "text-white"}`}
        >
          bnbIndia
        </p>
      </Link>

      <ProfileMenu navbarBg={navbarBg} />
    </nav>
  );
}
