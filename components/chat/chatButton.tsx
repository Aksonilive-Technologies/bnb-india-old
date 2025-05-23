"use client"

import { db } from "@/firebase/firebaseConfig";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    setDoc,
    arrayUnion,
    serverTimestamp,
  } from 'firebase/firestore';;

interface ChatButtonProps {
    host_id: String;
  }

export default function ChatButton({host_id}: ChatButtonProps ){

    // host_id = "01"
    const user_id = "03"

    const handleChatButtonClick = async () => {
        // Define a query to check if there's a document with both userid and hostid in the 'users' array
        const chatsCollection = collection(db, 'chats');
        const chatsQuery = query(
            chatsCollection,
            where('users', 'array-contains', user_id)
        );

        try {
            const querySnapshot = await getDocs(chatsQuery);
            let chatExists = false;

            querySnapshot.forEach((doc) => {
                const users = doc.data().users;
                if (users.includes(host_id)) {
                    chatExists = true;
                    console.log("Chat document found:", doc.id);
                }
            });

            if (chatExists) {
                console.log('Chat exists between these users.');
                // You can redirect to the chat or perform any other action here
            } else {
                console.log('No chat document found for these users.');
                // Create a new chat document
                const newChatRef = await addDoc(collection(db, 'chats'), {
                  users: [user_id, host_id],
                  timestamp: serverTimestamp(),
                });
                console.log('New chat created with ID:', newChatRef.id);
        
                // Update userchats for both users
                const userChatsRef = doc(db, 'userchats', String(user_id)); 
                const hostChatsRef = doc(db, 'userchats', String(host_id)); 
        
                // Update or create the userchats document for the current user
                await setDoc(
                  userChatsRef,
                  {
                    chats_id: arrayUnion(newChatRef.id),
                  },
                  { merge: true }
                );
        
                // Update or create the userchats document for the host user
                await setDoc(
                  hostChatsRef,
                  {
                    chats_id: arrayUnion(newChatRef.id),
                  },
                  { merge: true }
                );
        
                console.log('Chat IDs updated for both users.');
              }
            } catch (error) {
              console.error('Error checking or creating chat document:', error);
            }
    };

    return(
        <button onClick={handleChatButtonClick}>chat</button>
    )
}