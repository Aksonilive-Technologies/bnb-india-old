"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { useUserStore } from "@/store/store";
import ReservationDetails from "../../components/reservationDetails";
import MessageTextArea from "../../messageTextArea";
import { addConversation, sendMessage } from "@/actions/chat/chat.actions";
import { db } from "@/firebase/firebaseConfig";
import useChatStore from "../../chatStore";
import { doc } from "firebase/firestore";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { usePathname } from 'next/navigation'
import Link from "next/link";
import DynamicHead from "@/components/DynamicHead";

const ChatWindow = ({ params }: any) => {
  const reciver_id = params.id;
  const { user } = useUserStore();
  const sender_id = user.user_id;
  const [ChatData, setChatData] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  
  const [reciver, setReciver] = useState({
    userName: "",
    userImageURL: "",
  });

  const [chatId, setChatID] = useState(null);
  const { chatUsersData } = useChatStore();
  const router = useRouter();

  useEffect(() => {
    if (chatUsersData?.length && reciver_id) {
      const filteredChat = chatUsersData.filter((chat) => chat.userId === reciver_id);
      console.log(filteredChat);

      if (filteredChat.length > 0) {
        setReciver(filteredChat[0]);
      } else {
        setReciver({
          userName: "",
          userImageURL: "",
        });
      }
    }
  }, [chatUsersData, reciver_id]);
  // const unsubscribeRef = useRef<(() => void) | null>(null);

  const [sending, setSending] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  // const location = useLocation(); // Track current route location

  useEffect(() => {
    fetchConversation();
    console.log(usePathname);

    // Clean up the subscription whenever the component unmounts or location changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current() ;
        console.log("Unsubscribed from previous chat due to location change or unmounting.");
      }
    };
  }, [sender_id, reciver_id, usePathname]); // Add location.pathname as a dependency

  async function fetchConversation() {
    try {
      const response = await addConversation({ userId1: sender_id, userId2: reciver_id });
      if (response.success && response.chatId) {
        setChatID(response.chatId);
        unsubscribeRef.current = subscribeToMessages(response.chatId);
      }
    } catch (error) {
      console.error("Error fetching/creating conversation:", error);
    }
  }

  const subscribeToMessages = (conversationId: string): (() => void) => {
    const q = query(
      collection(db, "chats", conversationId, "Messages"),
      orderBy("timestamp", "desc")
    );
  
    const conversationDocRef = doc(db, "chats", conversationId);
  
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docSnapshot = await getDoc(conversationDocRef);
  
      if (docSnapshot.exists()) {
        const conversationData = docSnapshot.data();
  
        // Validate that window is available
        if (typeof window !== "undefined") {
          const currentUrlSenderId = window.location.pathname.split("/").pop(); // Assumes the sender ID is the last part of the URL
  
          // Update is_read for the conversation if sender ID matches the URL ID
          if (conversationData.sender_id === currentUrlSenderId) {
            await updateDoc(conversationDocRef, {
              is_read: true,
            });
            console.log("Conversation data updated as unread for the receiver");
          }
        }
      } else {
        console.log("No conversation document found.");
      }
  
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const currentUserId = sender_id; // Replace with the current user's ID
  
      // Validate that window is available before accessing location
      if (typeof window !== "undefined") {
        const currentUrlSenderId = window.location.pathname.split("/").pop(); // Assumes the sender ID is the last part of the URL
  
        // Mark messages as read if sender ID matches the URL ID
        messages.forEach(async (message: any) => {
          if (
            message.receiver === currentUserId &&
            !message.is_read &&
            message.sender === currentUrlSenderId
          ) {
            await updateDoc(doc(db, "chats", conversationId, "Messages", message.id), {
              is_read: true,
            });
            console.log(`Message ${message.id} marked as read`);
          }
        });
      }
  
      setChatData(messages);
    });
  
    return unsubscribe; // Return the unsubscribe function
  };
  

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    setSending(true);

    try {
      // Send message to the backend (API)
      const response = await sendMessage({

        senderId: sender_id,
        receiverId: reciver_id,
        messageText,
      });
      if (response.success) {

        setMessageText("");

      }
      else {
        console.log("error occoured : ", response.message)

      }
      setSending(false);
    } catch (error) {
      setSending(false);
      console.error("Error sending message:", error);
    }
  };

  const formatChatDate = (timestamp: any) => {
    const messageDate = new Date(timestamp.seconds * 1000); // Convert Firebase timestamp to JS Date object
    const today = new Date();

    // Check if the message is from today
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    // Check if the message is from yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    // Otherwise, return a formatted date like "23 Jan"
    return messageDate.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };




  return (
    <div className="flex">
      <DynamicHead title={`Chat | ${reciver.userName}`} />
      <div className="flex-1 p-2 border flex flex-col justify-between w-full h-[100vh] gap-3">
        {/* Header Section */}
        <div className="flex justify-between items-center py-4  h-[8%] bg-white ">
          <div className="flex items-center gap-3">

            {/* Back Button - visible only on mobile */}
            <button
              onClick={() => router.push('/chat')}
              className="p-2 border-2 border-gray-300 rounded-full hover:bg-gray-200 md:hidden"
              aria-label="Back to chat"
            >
              <AiOutlineArrowLeft className="text-sm text-gray-600" />
            </button>

            {reciver?.userName ? (
              <Link href={`/users/${reciver_id}`} className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                  <Image
                    alt="Profile pic"
                    src={reciver?.userImageURL || '/default-image.png'}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-lg font-medium text-gray-800">{reciver.userName}</p>
              </Link>
            ) : (
              <div className="flex gap-3 items-center">
                {/* Skeleton for Profile Picture */}
                <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>

                {/* Skeleton for Name */}
                <div className="h-4 w-24 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            )}
          </div>

          {/* <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 px-4 text-sm font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Make  Offer
          </button> */}
        </div>

        <hr className="my-1" />
        {/* // Rendering chat messages with updated comparison logic */}
        <div className="w-full flex flex-grow flex-col-reverse p-2 overflow-y-scroll display-no-scroll">
          {ChatData.length > 0 &&
            ChatData.map((data: any, index: number) => {
              const currentMessageDate = formatChatDate(data.timestamp);
              const previousMessageDate = index < ChatData.length - 1 ? formatChatDate(ChatData[index + 1].timestamp) : null

              // Show date header only if it's a new date
              const showDateHeader = currentMessageDate !== previousMessageDate;


              // const currReadStatus = data.is_read
              // const preVreadStatus = index < ChatData.length - 1 ? ChatData[index - 1].is_read : true;

              return (
                <div key={data.id}>
                  {showDateHeader && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 px-4 py-1 rounded-full text-gray-700 text-xs font-semibold shadow-sm">
                        {currentMessageDate}
                      </div>
                    </div>
                  )}

                  <div className={`flex sender mb-4 ${data.sender === reciver_id ? "" : "justify-end"}`}>
                    <div
                      className={`${data.sender === reciver_id
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100"} p-4 py-2 rounded-2xl max-w-[80%] flex flex-col`}
                    >
                      <p className="mb-1">{data.message}</p>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs text-gray-300 ${data.sender === reciver_id ? "self-start" : "self-end"}`}>
                          {new Date(data.timestamp.seconds * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
  
                        {/* Display single or double tick based on is_read status */}
                        <div className="ml-2 flex items-center">
                          {data.sender !== reciver_id && (
                            <span className="text-xs text-gray-400">
                              {data.is_read ? <BiCheckDouble className="text-blue-500" /> : <BiCheck />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>



        {/* Message Input Section */}
        <div className="items-end sticky py-3 pt-1 md:py-1 px-1 flex gap-2">
          <MessageTextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onEnterPress={handleSendMessage}
          />
          <button
            onClick={handleSendMessage}
            className={`bg-black px-6 py-2 text-white flex justify-center items-center rounded-xl ${sending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={sending} // Disable button when sending is true
          >
            {sending ? <p>Sending...</p> : <p>Send</p>}
          </button>
        </div>


        {/* Modal Section */}
        {/* {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#30303048]">
            <div className="h-[80%] w-[60%] bg-white rounded-lg drop-shadow-lg flex flex-col p-4 text-lg">
              <p className="font-bold text-xl">Special offer for Javed</p>
              <div className="absolute bottom-0 right-0 p-4 flex space-x-2 text-lg gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-black rounded-lg w-32 py-1 hover:rounded-none"
                >
                  cancel
                </button>
                <button className="border-2 border-black rounded-lg w-32 py-1 bg-black text-white hover:rounded-none">
                  make offer
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Reservation Details Section */}
      <div className="w-[30%] hidden lg:block">
        <ReservationDetails />
      </div>
    </div>
  );
};

export default ChatWindow;