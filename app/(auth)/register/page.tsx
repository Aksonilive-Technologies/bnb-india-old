"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { signUpWithEmailAndPassword, signUpWithGoogle } from "@/firebase/Auth";
import { auth } from "@/firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
// import { addUserDataInDB } from '@/utils/addUserDataInDB';
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import DynamicHead from "@/components/DynamicHead";

const SignUp: React.FC = () => {
  const router = useRouter();
  const querry = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setpasswordsMatch] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const validatePassword = (password: string) => {
    const newErrors = [];
    if (password.length < 8) newErrors.push("➤ At least 8 characters");
    if (!/[A-Z]/.test(password)) newErrors.push("➤ One uppercase letter (A-Z)");
    if (!/[a-z]/.test(password)) newErrors.push("➤ One lowercase letter (a-z)");
    if (!/[0-9]/.test(password)) newErrors.push("➤ One number (0-9)");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.push("➤ One special character (!@#$...)");

    setErrors(newErrors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  useEffect(() => {
    // Enable the button only if all fields are filled and passwords match
    const isValid =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword;

    setIsButtonEnabled(isValid);

    if (password !== "" && confirmPassword !== "") {
      setpasswordsMatch(password === confirmPassword)
    }

  }, [firstName, lastName, email, password, confirmPassword]);

  const getRedirectUrl = () => {
    const redirectUrl = querry!.get("redirect") as string | undefined;
    // console.log(redirectUrl);

    return redirectUrl || "/";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      if (
        !firstName ||
        !lastName ||
        !mobileNumber ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        setError("All fields are required.");
        toast.error("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        toast.error("Passwords do not match.");
        return;
      }

      try {
        toast.loading("Registering in...");
        const UserTokenData: any = await signUpWithEmailAndPassword(
          email,
          password,
          firstName,
          lastName,
          mobileNumber,
        );
        if (UserTokenData.status === 200) {
          toast.success("Registration Successful!");
          const redirectUrl = getRedirectUrl();
          router.push(redirectUrl);
        } else {
          toast.error(
            UserTokenData.error ||
            "Failed to sign up. Email is already in use.",
          );
          setError(
            UserTokenData.error ||
            "Failed to sign up. Please check your details and try again.",
          );
        }
      } catch (error) {
        console.error("Sign-up error: ", error);
        toast.error("Failed to sign up. Email is already in use.");
        setError("Failed to sign up. Please check your details and try again.");
      }

      setIsLoading(false);
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
        toast.success('Welcome! Redirecting...', { duration: 2000 });
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <DynamicHead title={"bnbIndia | SignUp"} />
      <div className="bg-white p-8 rounded-lg w-full max-w-md md:max-w-[30rem]">
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
        <h2 className="text-2xl font-semibold mb-1 text-left text-gray-800">
          Sign Up
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-left">
          Create your account to start managing your bookings.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="First Name"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Mobile Number"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email*
            </label>
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
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password*
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-10"
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Show real-time validation feedback */}
            <div className="mt-2 text-sm">
              {password.length > 0 && ( // Only show validation messages if the user has typed something
                errors.length > 0 ? (
                  <ul className="text-red-600">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600">✅ Password is strong</p>
                )
              )}
            </div>


          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password*
            </label>
            <div className="mt-1 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm pr-10"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <p className="text-red-700 font-semibold" hidden={passwordsMatch}>both password must match</p>
          <input type="hidden" name="redirect" value={getRedirectUrl()} />
          {/* <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md text-white red-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition font-semibold duration-300"
            >
              Sign Up
            </button>
          </div> */}
          <div>
            <button
              type="submit"
              disabled={!isButtonEnabled && errors.length > 0}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white red-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ${isButtonEnabled ? "" : "opacity-50 cursor-not-allowed"
                }`}
            // onClick={handleSubmit}
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
                  registering in...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <hr className="my-3" />
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


        <p className="text-gray-500 mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${getRedirectUrl()}`}
            className="text-pink-500 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

// export default SignUp ;

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUp />
    </Suspense>
  );
}
