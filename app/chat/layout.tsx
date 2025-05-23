import type { Metadata } from "next";
import Sidebar from './components/sidebar';

export const metadata: Metadata = {
  title: {
    default: "chats",
    template: `%s | chats`,
  },
  //   description: siteConfig.description,
  //   keywords: siteConfig.keywords,
  //   metadataBase: siteConfig.metadataBase,
};

export default function ChatPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
  <div className="h-screen">

      <div className='md:hidden'>
      {children}
      </div>
      <div className=" flex flex-col">
      <div className="hidden md:flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="w-full h-full bg-white">{children}</div>

      </div>
      </div>
      
    </div>
  </>;
}

// TODO: Add the other actions folder with user actions.
// TODO: Create auth route group folders.
