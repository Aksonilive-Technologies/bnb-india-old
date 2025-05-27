import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar/generalNavbar";
import BottomNavBar from "@/components/shared/navbar/generalBottomNavBar";

import "@/styles/globals.css";


export default function HostPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <>
      <Navbar />
        <div className="pb-24">
        {children}
        </div>
        <BottomNavBar/>
    </>
      
  );
}