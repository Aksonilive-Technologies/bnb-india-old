"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/firebase/firebaseConfig';
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error: any) {
      toast.error("Failed to send reset email. Please check your email address.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {emailSent ? (
          // Success message after email is sent
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Email Sent Successfully! 📩
            </h2>
            <p className="text-gray-700 text-sm">
              A password reset email has been sent to <span className="font-medium">{email}</span>.
              Please check your inbox (or spam folder) and follow the instructions.
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Next Steps:</h3>
              <ul className="list-decimal list-inside text-gray-700 text-sm mt-2 space-y-2">
                <li>Open the email and click the reset link.</li>
                <li>Follow the instructions to set a new password.</li>
                <li>After resetting, return to the login page and Login in with your new password.</li>
              </ul>
            </div>

            <a
              href="/login"
              className="inline-block mt-6 red-gradient text-white px-6 py-2 rounded-lg"
            >
              Go to Login
            </a>
          </div>
        ) : (
          // Form for requesting password reset
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6">
              Enter your registered email below, and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full red-gradient text-white  font-semibold py-2 rounded-lg  disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Step-by-step guide */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800">How to Reset Your Password:</h3>
              <ul className="list-decimal list-inside text-gray-700 text-sm mt-2 space-y-2">
                <li>Check your email inbox (including spam folder) for a reset link.</li>
                <li>Click the link provided in the email.</li>
                <li>Follow the instructions to create a new password.</li>
                <li>Use your new password to log in again.</li>
              </ul>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login in here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
