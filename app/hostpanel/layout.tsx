'use client'
import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar/HostNavbar";
import BottomNavBar from "@/components/shared/navbar/hostpanleBottomBar";
import { usePathname } from "next/navigation";
import "@/styles/globals.css";

export default function HostPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname() ?? "";

  // console.log("Current Pathname:", pathname); // Debugging

   // Define paths where BottomNavBar should be hidden
   const hiddenPaths = ["/hostpanel/listings/create", "/hostpanel/listings/update"];

   // Hide BottomNavBar if pathname contains any of the hidden paths
   const shouldHideBottomBar = hiddenPaths.some(path => pathname.includes(path));
 

  return (
    <>
      <Navbar />
      {children}
      {!shouldHideBottomBar && <BottomNavBar />}
    </>
  );
}
