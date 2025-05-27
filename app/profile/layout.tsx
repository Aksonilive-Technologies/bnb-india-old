
import type { Metadata } from "next";
import Navbar from "@/components/shared/navbar/generalNavbar";
import "@/styles/globals.css";




export const metadata: Metadata = {
    title: {
        default: 'Profile',
        template: `%s | Profile`,
    },
    //   description: siteConfig.description,
    //   keywords: siteConfig.keywords,
    //   metadataBase: siteConfig.metadataBase,
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <Navbar />
            {children}
            
        </div>

    );
}