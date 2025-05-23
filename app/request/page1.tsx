"use client";

import React, { useState, useEffect } from "react";
import { fetchUser, requestForHost } from "@/actions/users.actions"; // Ensure the path is correct
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RequestToBecomeHost = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const router = useRouter();
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await fetchUser();


        if (result.data?.isHost) {
          router.push('/hostpanel')
        }
        // console.log(result.success, result.data);

        if (result.success) {
          setFirstName(result?.data?.first_name || "");
          setLastName(result?.data?.last_name || "");
          setPhoneNumber(result?.data?.phone_number || "");
        } else {
          toast.error("You are not allowed");
        }
      } catch (err) {
        setError("An error occurred while fetching user details.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await requestForHost(phoneNumber, firstName, lastName);
      if (response.success) {
        toast.success("Application sent");
        setIsSubmitted(true);
      } else {
        toast.error("Error sending application");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your request.");
      console.error(error);
    }

  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/2 text-black flex flex-col justify-center items-center p-8 shadow-lg">
        {isSubmitted ? (
          <div className="w-full flex flex-col justify-center items-center p-8 bg-white text-black ">
            <h1 className="text-4xl text-gray-800 font-bold mb-4 text-center">
              Thank You for Applying!
            </h1>
            <hr className="border-black w-16 mb-4" />
            <p className="mb-6 text-center">
              Your application is under review. You will receive a call from us
              soon. We appreciate your interest in becoming a host and look
              forward to working with you!
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4 text-center">
              Become a Host
            </h2>
            <hr className="border-black w-16 mb-8" />
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold mb-2 text-gray-800"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold mb-2 text-gray-800"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold mb-2 text-gray-800"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-300 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your phone number"
                />
              </div>
              {/* 
              <div className="flex items-start">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-1 mr-2"
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-semibold text-gray-800"
                >
                  I consent and I want to be the host and host some villa on
                  this website
                </label>
              </div> */}
              <button
                type="submit"
                className="w-full p-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition duration-300"
              >
                Submit Request
              </button>
            </form>
          </>
        )}
      </div>
      <div className="w-1/2 relative">
        <img
          src="/h1.jpg"
          alt="Background"
          className="w-full h-full object-cover "
        />
        <div className="absolute bottom-0 left-0 p-8 w-full text-white bg-black bg-opacity-50 rounded-l-lg">
          <h1 className="text-3xl text-left font-bold mb-4">Become a Host</h1>
          <hr className="border-white w-16 mb-4" />
          <p className="mb-6 text-left">
            Being a host gives you the opportunity to set your price and get
            customers. Join our network and start hosting your villa today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestToBecomeHost;
