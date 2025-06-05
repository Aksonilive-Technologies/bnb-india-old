"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import DynamicHead from "@/components/DynamicHead";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', { email, password: '********' });
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Calling login function from AuthContext');
      const response = await login(email, password);
      console.log('Login response from AuthContext:', response);
      
      if (response.success) {
        toast.success("Logged in successfully!");
        router.push(redirectUrl);
      } else {
        setError(response.error || "Login failed. Please check your credentials.");
        toast.error(response.error || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      // Google sign-in will be implemented in a future update
      toast.error("Google Sign In is temporarily unavailable. Please use email/password login.");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DynamicHead title={"bnbIndia | Login"} />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-lg font-bold flex gap-2 items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={30}
              height={30}
              className="h-8 w-8"
            />
            <p className="pt-3 pb-0 font-extrabold text-2xl text-black">
              BnbIndia
            </p>
          </Link>
        </div>
        <h2 className="text-3xl font-semibold mb-2 text-left text-gray-800">
          Login
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-left">
          Access your account and manage your bookings.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer mt-1"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white red-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0l4 4-4 4V5a6 6 0 00-6 6h1z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-300"
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0l4 4-4 4V5a6 6 0 00-6 6h1z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <FcGoogle className="mr-2" size={20} />
                  Sign in with Google
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between mt-6 text-sm">
          <Link
            href="/forgot-password"
            className="text-pink-600 hover:text-pink-900"
          >
            Forgot Password?
          </Link>
          <Link
            href="/register"
            className="text-pink-600 hover:text-pink-900"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return <Login />;
}
