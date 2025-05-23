"use server";
import { db } from "@/firebase/firebaseConfig";
// chatService.ts
import { decrypt } from "@/utils/Encryption";
import { cookies } from "next/headers";
import {
    doc,
    getDoc,
    setDoc,
    arrayUnion,
    serverTimestamp,
    addDoc,
    collection,
    updateDoc,
    query,
    orderBy,
    onSnapshot,
    getDocs,
} from "firebase/firestore";
import { fetchUser } from "../users.actions";

const generateUniqueChatId = () => {
    return Math.random().toString(36).substring(2, 15);
};

export const addConversation = async ({
    userId1,
    userId2,
}: {
    userId1: string;
    userId2: string;
}) => {
    try {
        // Generate a random chat ID
        const chatId = generateUniqueChatId();

        // Check if the users already have a chat
        const userChatsRef1 = doc(db, "userChats", userId1);
        const userChatsRef2 = doc(db, "userChats", userId2);

        // Fetch user chat documents
        const userChatsSnap1 = await getDoc(userChatsRef1);
        const userChatsSnap2 = await getDoc(userChatsRef2);

        let chatExists = false;
        let existingChatId = null;

        // Check if the conversation already exists between the users
        if (userChatsSnap1.exists() && userChatsSnap2.exists()) {
            const userChats1 = userChatsSnap1.data().chat_ids || [];
            const userChats2 = userChatsSnap2.data().chat_ids || [];

            // Find if there's a common chat ID in both userChats
            existingChatId = userChats1.find((chatId: any) => userChats2.includes(chatId));
            chatExists = !!existingChatId;
        }

        // // If chat exists, return the existing chatId and user details
        if (chatExists) {
            // const user1Response = await fetchUser(userId1);
            // const user2Response = await fetchUser(userId2);

            // if (!user1Response.success || !user2Response.success) {
            //     return { success: false, error: "Failed to fetch user details" };
            // }

            // const userDetails1 = user1Response.data;
            // const userDetails2 = user2Response.data;

            return {
                success: true,
                chatId: existingChatId,
                // users: [
                //     { id: userId1, name: userDetails1?.first_name + " " + userDetails1?.last_name, imageURL: userDetails1?.profile_image },
                //     { id: userId2, name: userDetails2?.first_name + " " + userDetails2?.last_name, imageURL: userDetails2?.profile_image },
                //     // { id: userId2, name: userDetails2.name, imageURL: userDetails2.imageURL },
                // ],
            };
        }

        // Fetch user details before creating a new chat
        const user1Response = await fetchUser(userId1);
        const user2Response = await fetchUser(userId2);

        if (!user1Response.success || !user2Response.success) {
            return { success: false, error: "Failed to fetch user details" };
        }

        const userDetails1 = user1Response.data;
        const userDetails2 = user2Response.data;

        // If chat doesn't exist, create a new one and store both users' details
        const newChatId = chatId;
        await setDoc(doc(db, "chats", newChatId), {
            timestamp: serverTimestamp(),
            users: [
                { id: userId1, name: userDetails1?.first_name + " " + userDetails1?.last_name, imageURL: userDetails1?.profile_image },
                { id: userId2, name: userDetails2?.first_name + " " + userDetails2?.last_name, imageURL: userDetails2?.profile_image },
            ],
        });

        // Update userChats for both users
        await setDoc(userChatsRef1, { chat_ids: arrayUnion(newChatId) }, { merge: true });
        await setDoc(userChatsRef2, { chat_ids: arrayUnion(newChatId) }, { merge: true });

        return {
            success: true,
            chatId: newChatId,
            users: [
                { id: userId1, name: userDetails1?.first_name + " " + userDetails1?.last_name, imageURL: userDetails1?.profile_image },
                { id: userId2, name: userDetails2?.first_name + " " + userDetails2?.last_name, imageURL: userDetails2?.profile_image },
            ],
        };

    } catch (error) {
        console.error("Error in addConversation:", error);
        return { success: false, error: "Failed to fetch or create conversation" };
    }
};



// 5. Fetch a specific chat's messages
export const fetchChatData = async (chatId: string) => {
    try {
        // Reference to the chat document
        const chatRef = doc(db, "chats", chatId);

        // Fetch the chat document
        const chatSnapshot = await getDoc(chatRef);

        // Check if the chat document exists
        if (chatSnapshot.exists()) {
            return {
                id: chatSnapshot.id,
                // Chat document ID
                ...chatSnapshot.data() // All chat document fields (users, metadata, etc.)
            };
        } else {
            return null;  // Chat document not found
        }
    } catch (error) {
        console.error("Error fetching chat document:", error);
        return null;
    }
};



export const fetchUserChats = (userId: string, updateChats: (data: any) => void) => {
    try {
        const userChatsRef = doc(db, "userChats", userId);

        // Set up Firestore listener for real-time updates
        const unsubscribe = onSnapshot(userChatsRef, async (userChatsSnap) => {
            if (userChatsSnap.exists()) {
                const chatIds = userChatsSnap.data()?.chat_ids || [];

                const chatDetails = await Promise.all(
                    chatIds.map(async (chatId: string) => {
                        const chatRef = doc(db, "chats", chatId);
                        const chatSnap = await getDoc(chatRef);

                        if (!chatSnap.exists()) {
                            return null;
                        }

                        const chatData = chatSnap.data();
                        const receiverID = chatData.users[0].id === userId ? chatData.users[1].id : chatData.users[0].id;

                        return {
                            userId: receiverID,
                            userName: chatData.users[0].id === userId ? chatData.users[1].name : chatData.users[0].name,
                            userImageURL: chatData.users[0].id === userId ? chatData.users[1].imageURL : chatData.users[0].imageURL,
                            lastMessage: chatData?.lastMessage,
                            lastMessageTimestamp: chatData?.timestamp || null,
                        };
                    })
                );

                // Filter out null values and update the chats
                const filteredChatDetails = chatDetails.filter((chat) => chat !== null);
                updateChats(filteredChatDetails);
            } else {
                updateChats([]); // No chats
            }
        });

        // Return the unsubscribe function to clean up the listener
        return unsubscribe;
    } catch (error) {
        console.error("Error fetching user chats:", error);
        return () => { }; // Return an empty function in case of error
    }
};


export const sendMessage = async ({
    senderId,
    receiverId,
    messageText,
}: {
    senderId: string;
    receiverId: string;
    messageText: string;
}) => {
    try {
        // Step 1: Fetch user chats for both sender and receiver
        const userChatsRefSender = doc(db, "userChats", senderId);
        const userChatsRefReceiver = doc(db, "userChats", receiverId);

        const userChatsSnapSender = await getDoc(userChatsRefSender);
        const userChatsSnapReceiver = await getDoc(userChatsRefReceiver);

        let chatId = null;

        // Step 2: Check if both users have a common chatId
        if (userChatsSnapSender.exists() && userChatsSnapReceiver.exists()) {
            const senderChats = userChatsSnapSender.data()?.chat_ids || [];
            const receiverChats = userChatsSnapReceiver.data()?.chat_ids || [];

            if (!Array.isArray(senderChats) || !Array.isArray(receiverChats)) {
                console.error("Error: chat_ids should be an array");
                return { success: false, message: "Invalid chat data structure" };
            }

            // Find a common chat ID where both users are involved
            chatId = senderChats.find((chat: any) => receiverChats.includes(chat));
        }

        // Step 3: If no existing chat is found, return an error
        if (!chatId) {
            console.log("NO id found");

            return { success: false, message: "No chat exists between the users" };
        }
        console.log("Found chatId:", chatId);

        // Step 4: Add the new message in the Messages subcollection of the found chat
        const messageRef = await addDoc(collection(db, "chats", chatId, "Messages"), {
            sender: senderId,
            receiver: receiverId,
            message: messageText,
            is_edited: false,
            is_read: false,
            timestamp: serverTimestamp(),
            updated_time: null,
        });

        // Step 5: Optionally, update the chat document with the last message for reference
        await updateDoc(doc(db, "chats", chatId), {
            lastMessage: messageText,
            lastMessageTimestamp: serverTimestamp(),
            is_read: false,
            sender_id: senderId
        });

        return { success: true, messageId: messageRef.id };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, message: "Failed to send message" };
    }
};


