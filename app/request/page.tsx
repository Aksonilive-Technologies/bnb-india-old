"use client";

import React, { useState, useEffect } from "react";
import { fetchUser, requestForHost } from "@/actions/users.actions"; // Ensure the path is correct
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
const RequestToBecomeHost = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useUserStore();

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
                setUser({
                    ...useUserStore.getState().user,
                    isHost: true
                });
                setTimeout(() => {
                    router.push('/hostpanel');
                }, 5000);
            } else {
                toast.error("Error sending application");
            }
        } catch (error) {
            toast.error("An error occurred while submitting your request.");
            console.error(error);
        }

    };

    // if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex items-left justify-center md:justify-end min-h-screen bg-gray-100">

            <div className="w-[90%] my-[10vh] rounded-2xl h-[80%] lg:w-1/3 left-[5%] absolute md:right-[60%] bg-white text-black flex flex-col justify-center items-center p-8 shadow-lg md:p-8 z-10 transform transition-transform duration-500 ease-in-out">
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
                        <p className="text-center text-gray-600 mb-4">Join our network and start hosting your villa today!</p>
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
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white red-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                            >
                                Submit Request
                            </button>
                        </form>
                    </>
                )}
            </div>
            <div className="hidden lg:block p-3 w-4/6">
                <img
                    src="/h1.jpg"
                    alt="Background"
                    className="w-full rounded-2xl h-full object-cover"
                />
            </div>
        </div>

    );
};

export default RequestToBecomeHost;
