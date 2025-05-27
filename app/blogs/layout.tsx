import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar/blogsNavBar";

import BottomNavBar from "@/components/shared/navbar/generalBottomNavBar";

import "@/styles/globals.css";



export const metadata: Metadata = {
  title: {
    default: 'Blogs',
    template: `%s | Blogs`,
  },
//   description: siteConfig.description,
//   keywords: siteConfig.keywords,
//   metadataBase: siteConfig.metadataBase,
};

export default function HostPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <>
      <Navbar />
        {children}
        <BottomNavBar/>
       
    </>
      
  );
}