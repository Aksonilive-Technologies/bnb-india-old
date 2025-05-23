import { create } from "zustand";
import { useUserStore } from "./store";

interface User {
  id: string;
  blocked: string[];
  // Add more fields as necessary based on your application
}

interface ChatState {
  chatId: string | null;
  user: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeBlock: () => void;
  resetChat: () => void;
  // Uncomment this if you plan to use `changeChat` function
  // changeChat: (chatId: string, user: User) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  

//   Uncomment and complete the function if needed
//   changeChat: (chatId: string, user1: User) => {

//     const {user} = useUserStore();
//     const currentUser = user.user_id; // You may need to modify this depending on how useUserStore work
//     // const currentUser = "abc" // For testing purposes

//     // CHECK IF CURRENT USER IS BLOCKED
//     if (user.blocked.includes(currentUser)) {
//       return set({
//         chatId,
//         user: null,
//         isCurrentUserBlocked: true,
//         isReceiverBlocked: false,
//       });
//     }

//     // CHECK IF RECEIVER IS BLOCKED
//     else if (currentUser.blocked.includes(user.id)) {
//       return set({
//         chatId,
//         user: user,
//         isCurrentUserBlocked: false,
//         isReceiverBlocked: true,
//       });
//     } else {
//       return set({
//         chatId,
//         user,
//         isCurrentUserBlocked: false,
//         isReceiverBlocked: false,
//       });
//     }
//   },

  
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
