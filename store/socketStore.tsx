import { create } from 'zustand';
import { io } from 'socket.io-client';
import { getRecentRecords } from '@/actions/analytics/analytics..action';
import { useUserStore } from './store';

interface SocketState {
    socket: any;
    bookings: any[];
    NotificationData: any;
    setSocket: (socket: any) => void;
    connectSocket: () => void;
    disconnectSocket: () => void;
    fetchMostRecentData: () => Promise<void>;
}
export const useSocketStore = create<SocketState>((set) => ({
    socket: null,
    bookings: [],
    NotificationData: null,

    setSocket: (socket) => set({ socket }),

    fetchMostRecentData: async () => {
        const { user } = useUserStore.getState(); // Access user from useUserStore
        if (!user || !user.user_id) {
            console.error('User not found or not authenticated');
            return;
        }
        const userId = user.user_id
        try {
            // console.log('Fetching most recent data for user:', userId);
            const response = await getRecentRecords(userId);
            // console.log(response);
            if (response.success) {
                const data = response.data;
                // if (data.success) {
                set({ NotificationData: data });
                // console.log('Updated NotificationData:', data);
                // }
            } else {
                console.error('Failed to fetch notifications:', response.error);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    },

    connectSocket: () => {

        const { user } = useUserStore.getState(); // Access user from useUserStore
        if (!user || !user.user_id) {
            console.error('User not found or not authenticated');
            return;
        }
        const userId = user.user_id
        // console.log('Connecting to socket server...');
        const socket = io(process.env.NEXT_PUBLIC_CUSTOM_SERVER_URL || 'http://13.233.30.246:5000');

        // Register the user with their owner ID
        socket.emit('register', userId);

        useSocketStore.getState().fetchMostRecentData();
        // Listen for new booking notifications
        socket.on('newBookingNotification', () => {
            console.log('Received new booking notification signal');
            useSocketStore.getState().fetchMostRecentData();
        });
        
        // Listen for refund notifications
        // console.log('Received new booking notification signal');
        socket.on('Notification', () => {
            // console.log('Received refund notification signal');
            useSocketStore.getState().fetchMostRecentData();
        });

        set({ socket });
    },

    disconnectSocket: () => {
        set((state) => {
            state.socket?.disconnect();
            return { socket: null, bookings: [], NotificationData: [] };
        });
    },
}));
