import { create } from 'zustand';
import {doc, onSnapshot} from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig";

// Define types for chat and chat user data
interface ChatUserData {
    userId: string;
    userName: string;
    userImageURL: string;
    lastMessage: string;
    lastMessageTimestamp: any;
}

interface ChatState {
    chatUsersData: ChatUserData[];
    reciver: any;
    isChatOpen: Boolean;
    conversationId: any;
    fetchChats: (sender_id: string) => void;
    setReciver: (data: any) => void;
    openChat: () => void;
    closeChat: () => void;
    setConversationId: (id: any) => void;
}

// Zustand store
const useChatStore = create<ChatState>((set) => ({
    chatUsersData: [],
    isChatOpen: false,
    conversationId: null,
    openChat: () => set({ isChatOpen: true }),
    closeChat: () => set({ isChatOpen: false }),
    reciver: {},
    setReciver: (data) => {
        set({ reciver: data })
    },
    setConversationId: (id: any) => set({ conversationId: id }),
    // Fetch chats based on the sender_id
    fetchChats: (sender_id) => {
        // set({ isLoading: true });

        const userChatsRef = doc(db, 'userChats', sender_id);

        const unsubscribe = onSnapshot(userChatsRef, (userChatsSnap) => {
            if (userChatsSnap.exists()) {
                const chatIds = userChatsSnap.data()?.chat_ids || [];

                const chatListeners = chatIds.map((chatId: string) => {
                    const chatRef = doc(db, 'chats', chatId);

                    return onSnapshot(chatRef, (chatSnap) => {
                        if (!chatSnap.exists()) {
                            return null;
                        }

                        const chatData = chatSnap.data();
                        const receiverID = chatData.users[0].id === sender_id ? chatData.users[1].id : chatData.users[0].id;

                        const updatedChatDetails = {
                            userId: receiverID,
                            userName: chatData.users[0].id === sender_id ? chatData.users[1].name : chatData.users[0].name,
                            userImageURL: chatData.users[0].id === sender_id ? chatData.users[1].imageURL : chatData.users[0].imageURL,
                            lastMessage: chatData?.lastMessage,
                            senderId: chatData?.sender_id,
                            is_read: chatData?.is_read,
                            lastMessageTimestamp: chatData?.lastMessageTimestamp || null,
                        };
                        // console.log("new chat deatails @ chastore is ", updatedChatDetails);

                        set((state) => {
                            const updatedChats = state.chatUsersData.map((chat) =>
                                chat.userId === updatedChatDetails.userId ? updatedChatDetails : chat
                            );

                            if (!state.chatUsersData.some((chat) => chat.userId === updatedChatDetails.userId)) {
                                updatedChats.push(updatedChatDetails);
                            }

                            updatedChats.sort((a, b) => {
                                const timeA = a.lastMessageTimestamp?.toMillis?.() || 0;
                                const timeB = b.lastMessageTimestamp?.toMillis?.() || 0;
                                return timeB - timeA;
                            });
                            console.log(updatedChats);

                            return { chatUsersData: updatedChats };
                        });
                    });
                });

                // Clean up listeners when unmounting
                return () => chatListeners.forEach((unsubscribe: any) => unsubscribe());
            } else {
                set({ chatUsersData: [] });
            }

            //   set({ isLoading: false });
        });

        // Clean up main listener when unmounting
        return () => unsubscribe();
    },
}));

export default useChatStore;
