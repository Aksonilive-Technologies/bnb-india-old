import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar/NavbarWithSearchBar";
import DynamicSearchBarMobile from "@/components/shared/searchbars/dynamicSeachBarMobile";

import "@/styles/globals.css";



export const metadata: Metadata = {
  title: {
    default: 'bnbIndia | Listing',
    template: `%s | Listing`,
  },
  //   description: siteConfig.description,
  //   keywords: siteConfig.keywords,
  //   metadataBase: siteConfig.metadataBase,
};

export default function ListingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="hidden md:block sticky top-0 h-auto z-50">
        <Navbar />
      </div>

      <div className="flex justify-center z-[100] fixed top-0 pt-3 gap-1 px-1 w-full bg-white items-center md:hidden">
                <DynamicSearchBarMobile />
              </div>
      <div className="md:mt-40 relative">

        {children}

      </div>

      {/* <div className=" lg:block">

        <Navbar />
      </div> */}
    </>

  );
}
