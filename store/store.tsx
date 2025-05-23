'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUser } from '@/actions/users.actions';

interface UserState {
    user: any;
    isLoading: boolean;
    hasFetched: boolean;
    getUserData: (uid?: string) => Promise<void>; // Updated to return void
    setUser: (user: any) => void;
    setIsLoading: (isLoading: boolean) => void;
    setHasFetched: (hasFetched: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            hasFetched: false,
            setUser: (user) => set({ user }),
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            setHasFetched: (hasFetched: boolean) => set({ hasFetched }),
            getUserData: async (uid?: string) => {
                get().setIsLoading(true);
                try {
                    const userData: any = await fetchUser(uid);
                    // console.log("Fetched user data", userData.data);
                    if (userData.success) {
                        if (userData.data) {
                            set({
                                user: {
                                    ...get().user,
                                    isHost: userData.data.isHost,
                                    ...userData.data
                                },
                                hasFetched: true,
                                isLoading: false,
                            });
                        } else {
                            console.error("User not found");
                        }
                    } else {
                        console.error("You are not authenticated");
                        set({ hasFetched: false }); 
                        // Update hasFetched in case of an error
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                } finally {
                    get().setIsLoading(false);
                }
                // console.log("User", get().user);
                // console.log("hasFecthed", get().hasFetched); 
            },
        }),
        {
            name: 'user-store', // unique name for storage
            getStorage: () => localStorage, // (optional) by default it uses localStorage
        }
    )
);
