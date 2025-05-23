import Sidebar from "./components/sidebar";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function ChatPage() {
  return (
    <div className="h-screen">
      <div className="hidden md:flex flex-col w-full h-full  justify-center items-center text-gray-400">
        <HiOutlineChatBubbleLeftRight className="size-28 " />
        <p className="text-xl">bnbIndia chats</p>
        <p>A space for our hosts and guests to enjoy meaningful conversations over chai.</p>
      </div>
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
};

