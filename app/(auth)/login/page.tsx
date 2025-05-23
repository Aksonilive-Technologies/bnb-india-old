'use client';

import React, { useState, Suspense } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from 'next/navigation';
import { signUpWithGoogle, loginWithEmailAndPassword } from '@/firebase/Auth';
import Link from 'next/link';
import Image from 'next/image';
import DynamicHead from "@/components/DynamicHead";
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Added for Google sign-in loading state
  const router = useRouter();
  const query = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getRedirectUrl = (): string => {
    const redirectUrl = query?.get("redirect");
    return redirectUrl || '/';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      setError('');

      try {
        const userCredential = await loginWithEmailAndPassword(email, password);
        if (userCredential.status === 200) {
          toast.success('Logged in successfully! Redirecting...', );
          const redirectUrl = getRedirectUrl();
          router.push(redirectUrl);
        } else {
          setError(userCredential.error || "Login failed. Please try again.");
          toast.error(userCredential.error || "Login failed. Please try again.", { duration: 3000 });
        }
      } catch (error) {
        console.error("Unexpected login error:", error);
        setError("An unexpected error occurred. Please try again later.");
        toast.error("An unexpected error occurred. Please try again later.", { duration: 3000 });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true); // Start Google sign-in loading
    let toastId: string | undefined;

    try {
      // Show loading toast
      toastId = toast.loading('Signing in with Google...', { duration: Infinity });

      // Initialize Google provider and sign in with popup
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get the ID token from the result
      const token = await result.user.getIdToken();

      // Send the token to your server for verification
      const response: any = await signUpWithGoogle(token);

      // Remove the loading toast
      toast.remove(toastId);

      if (response.status === 200) {
        toast.success('Welcome! Redirecting...');
        const redirectUrl = getRedirectUrl();
        router.push(redirectUrl);
      } else {
        console.error('Google sign-in error: ', response.error);
        setError(response.error);
        toast.error('Something went wrong. Please try again.', { duration: 3000 });
      }
    } catch (error: any) {
      // Remove the loading toast
      if (toastId) toast.remove(toastId);

      // Handle specific Firebase errors
      let errorMessage = 'Something went wrong. Please try again.';
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled. Please try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'No internet connection. Please check your network.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in cancelled. Please try again.';
          break;
        default:
          errorMessage = 'Something went wrong. Please try again.';
      }

      // Set the error state and show error toast
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });

      console.error('Google sign-up error: ', error);
    } finally {
      setIsGoogleLoading(false); // End Google sign-in loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <DynamicHead title={"bnbIndia | Login"} />
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-lg font-bold flex gap-2 items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={30}
              height={30}
              className="h-8 w-8"
            />
            <p className="pt-3 pb-0 font-extrabold text-2xl text-black">BnbIndia</p>
          </Link>
        </div>
        <h2 className="text-3xl font-semibold mb-2 text-left text-gray-800">Login</h2>
        <p className="text-sm text-gray-600 mb-6 text-left">Access your account and manage your bookings.</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Password"
              required
            />
          </div>
          <input type="hidden" name="redirect" value={getRedirectUrl()} />
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white red-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
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
                'Login'
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <Link href="/forgot-password" className="text-pink-600 hover:text-pink-900">Forgot Password?</Link>
          <Link href={`/register?redirect=${getRedirectUrl()}`} className="text-pink-600 hover:text-pink-900">Create Account</Link>
        </div>
        <hr className="my-6" />
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium items-center gap-2 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <div className="flex items-center">
              <FaSpinner className="animate-spin h-5 w-5 mr-3 text-gray-600" /> {/* Spinner icon */}
              Signing in...
            </div>
          ) : (
            <>
              <FcGoogle size={26} className="hover:scale-105 transition-transform duration-200" />
              <p className="text-gray-700 hover:text-gray-900 transition-colors duration-200">Sign In with Google</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}