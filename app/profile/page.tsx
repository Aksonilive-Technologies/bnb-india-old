
'use client'

import React, { useEffect, useState } from 'react';
import { SlUser, SlHeart } from 'react-icons/sl';
import { BiSupport } from 'react-icons/bi';
import { MdLocalOffer } from 'react-icons/md';
import { ImFolderUpload } from 'react-icons/im';
import { SlArrowRight } from "react-icons/sl";
import { FaSignOutAlt } from 'react-icons/fa';
import { fetchUser } from '@/actions/users.actions';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Profile() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
    email_id:"",
    profileImage: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result: any = await fetchUser();
        // console.log(result.data);

        if (result.success) {
          setUser(result?.data);
        } else {
          toast.error("You are not allowed");
        }
      } catch (err) {
        toast.error("Server error: ");
        console.error(err);
      }
      setLoading(false);
    };

    fetchDetails();
  }, []);

  const settings = [
    {
      title: 'Personal info', description: 'Provide personal details and how we can reach you', icon: <SlUser size={22} />,
      href: "/profile/Edit"
    },
    { title: 'Saved Villas', description: 'View your saved villas', icon: <SlHeart size={22} />, href: "/profile/savedvillas" },
    { title: 'My Bookings', description: 'View your bookings', icon: <ImFolderUpload size={22} />, href: "/profile/mybookings" },
    // { title: 'Payments & payouts', description: 'Review payments, payouts, http://localhost:3000/profile/notificationscoupons and gift cards', icon: <SlCreditCard size={22} />, href: "/profile" },
    // { title: 'Notifications', description: 'Choose notification preferences and how you want to be contacted', icon: <SlBell size={22} />, href: "/profile/notifications" },
    { title: 'Coupons', description: 'Manage your coupons', icon: <MdLocalOffer size={22} />, href: "/profile" },
    { title: 'Help and Support', description: 'Get help and support', icon: <BiSupport size={22} />, href: "/helpandsupport" },
  ];

  return (
    <div className="max-w-6xl mt-[1vh] mx-auto py-10 px-4 overflow-x-hidden sm:px-6 lg:px-8">
      {loading ? (
        <div className="animate-pulse">
          {/* Skeleton Loader for Profile Header */}
          <div className="flex gap-5 justify-start items-center flex-row mb-4">
            <div className="w-[100px] h-[70px] md:w-32 md:h-32 bg-gray-200 rounded-full"></div>
            <div className="ml-0 md:ml-5 mt-4 md:mt-0 md:text-left">
              <div className="w-40 h-6 bg-gray-200 rounded mb-2"></div>
              <div className="w-64 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
          <hr className="mb-4" />
          {/* Skeleton Loader for Settings */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-row items-center md:flex-col md:items-start md:justify-between md:h-44 md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-300 gap-4 p-3 md:p-6 md:rounded-lg bg-white md:hover:border hover:border-pink-600"
              >
                <div className="h-full w-full md:w-12 md:h-12 bg-gray-200 rounded-md"></div>
                <div className="flex-1 md:flex md:flex-col ml-4">
                  <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-40 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="md:hidden">
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
          {/* Skeleton Loader for Logout Button */}
          <div className="flex items-center justify-center w-full mt-5 h-[40px] rounded-lg bg-gray-200 text-white font-bold cursor-not-allowed">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
            <div className="w-16 h-5 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl md:hidden md:text-4xl w-full font-bold">Profile</h1>
          <div className="mt-4 mb-3 flex gap-5 justify-start  items-center flex-row">
            <div className="w-[100px] h-[70px] md:w-32 md:h-32">
              {user?.profile_image ? (
                <img src={user?.profile_image} alt="profile image" className="rounded-full object-cover w-full h-full" />
              ) : (
                <div className="rounded-full object-cover bg-gray-200 w-full h-full"></div>
              )}
            </div>
            <div className='ml-0 md:ml-5 mt-4 md:mt-0 md:text-left'>
              <h1 className="text-2xl hidden md:block md:text-4xl font-bold">Profile</h1>
              <span className="font-bold text-lg">{user?.first_name + " " + user?.last_name}</span>, {user?.email_id}

            </div>
          </div>
          <hr />
          <Link href="/hostpanel/listings/create" className="flex mt-6 md:hidden items-center p-6 bg-white rounded-lg border border-pink-600 shadow-md">
            <div className="ml-4">
              <h2 className="text-xl font-bold">Host your place</h2>
              <p className="text-gray-600">It's simple to get set up and start earning.</p>
            </div>
            <img
              src="/3d-rendering-isometric-house-model.png"
              alt="House"
              className="w-20 h-20 object-cover"
            />
          </Link>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {settings.map((setting, index) => (
              <a
                key={index}
                href={setting.href}
                className="flex flex-row items-center md:flex-col md:items-start md:justify-between md:h-44 md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-300 gap-4 p-3 md:p-6 md:rounded-lg bg-white md:hover:border hover:border-pink-600"
              >
                <div className="flex items-center pt-1 justify-center">
                  <div className="h-full w-full md:w-12 md:h-12 text-gray-500">{setting.icon}</div>
                </div>
                <div className="flex-1 md:flex md:flex-col">
                  <h2 className="text-xl font-semibold md:font-bold ">{setting.title}</h2>
                  <p className="text-md hidden md:block text-gray-600">{setting.description}</p>
                </div>
                <div className=" md:hidden">
                  <SlArrowRight size={20} className="text-gray-400" />
                </div>
                <hr className='md:hidden' />
              </a>
            ))}
          </div>
          <div className="flex items-center justify-center w-full mt-5 h-[40px] rounded-lg red-gradient text-white font-bold cursor-pointer hover:bg-blue-100 hover:text-red-600 transition-colors duration-300 z-50 md:hidden">
            <FaSignOutAlt size={20} className="mr-2" />
            Logout
          </div>
        </>
      )}
    </div>
  );
}
