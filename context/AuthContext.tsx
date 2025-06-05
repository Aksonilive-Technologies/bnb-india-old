"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

// Define API response types
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  [key: string]: any;
};

// Define the User type based on the API response
export type User = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  email_id: string;
  phone_number?: string;
  profile_image?: string;
  isHost: boolean;
  [key: string]: any; // Allow for additional properties
};

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateUser: async () => ({ success: false }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the application
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to get token from cookies (client-side)
  const getTokenFromCookie = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('access-token='))
      ?.split('=')[1];
    
    return cookieValue || null;
  };

  // Function to set token in cookie (client-side)
  const setTokenInCookie = (token: string, expiryDays: number = 30) => {
    if (typeof document === 'undefined') return;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    document.cookie = `access-token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  };

  // Function to remove token from cookie (client-side)
  const removeTokenFromCookie = () => {
    if (typeof document === 'undefined') return;
    
    document.cookie = "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "isHost=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Load user on initial mount or when token changes
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const storedToken = getTokenFromCookie();
        
        if (storedToken) {
          setToken(storedToken);
          
          // Fetch current user using token
          const response = await authApi.getCurrentUser(storedToken) as ApiResponse<User>;
          
          if (response.success && response.user) {
            setUser(response.user);
            
            // Set isHost cookie based on user data
            const isHost = response.user.isHost ? "yes" : "no";
            document.cookie = `isHost=${isHost}; path=/; max-age=${30 * 24 * 60 * 60}`;
          } else {
            // Invalid token or user not found
            setUser(null);
            setToken(null);
            removeTokenFromCookie();
          }
        } else {
          // No token found
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
        setToken(null);
        removeTokenFromCookie();
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("AuthContext: Calling login API with email:", email);
      const response = await authApi.login(email, password);
      console.log("AuthContext: Raw login API response:", response);

      // Normalize success to boolean
      let isSuccess = response.success;

      // Only treat as success if token and user are present
      if (isSuccess && response.data.token && response.data.user) {
        setToken(response.data.token);
        setUser(response.data.user);
        setTokenInCookie(response.data.token);

        // Set isHost cookie based on user data
        const isHost = response.data.user.role === "host" ? "yes" : "no";
        document.cookie = `isHost=${isHost}; path=/; max-age=${30 * 24 * 60 * 60}`;

        return { success: true };
      } else {
        // Avoid showing 'Logged in successfully!' as error
        let errorMsg = response.message || "Login failed. Please check your credentials.";
        return {
          success: false,
          error: errorMsg
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed. Please try again."
      };
    } finally {
      setIsLoading(false);
    }
  };


  // Register function
  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData) as ApiResponse<User>;
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        setTokenInCookie(response.token);
        
        // Set isHost cookie to "no" for new users
        document.cookie = `isHost=no; path=/; max-age=${30 * 24 * 60 * 60}`;
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || "Registration failed. Please try again." 
        };
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        error: error.message || "Registration failed. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    // Clear user data and token
    setUser(null);
    setToken(null);
    removeTokenFromCookie();
    
    // Redirect to home page
    router.push('/login');
  };

  // Update user function
  const updateUser = async (userData: Partial<User>) => {
    if (!token) {
      return { 
        success: false, 
        error: "Not authenticated" 
      };
    }

    try {
      setIsLoading(true);
      const response = await authApi.updateUserProfile(token, userData) as ApiResponse<User>;
      
      if (response.success && response.user) {
        setUser(response.user);
        
        // Update isHost cookie if role has changed
        if (userData.isHost !== undefined) {
          const isHost = response.user.isHost ? "yes" : "no";
          document.cookie = `isHost=${isHost}; path=/; max-age=${30 * 24 * 60 * 60}`;
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || "Failed to update profile. Please try again." 
        };
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to update profile. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
