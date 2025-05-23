"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  addWishlistForUser,
  deleteWishlistForUser,
  fetchWishlistForUserPerVilla,
} from "@/actions/listing/listing.action";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import toast from "react-hot-toast";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { GoShareAndroid } from "react-icons/go";

export default function ShareNlike({ VillaId }: { VillaId: string }) {
  const [saved, setsaved] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(true); // New loading state


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShareClick = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : 'NA');
    setIsShareMenuOpen(false);
    toast.success("Link copied to clipboard!");
  };

  const handleSave = async (Save: boolean) => {
    setsaved(Save)
    if (user) {
      if (Save) {
        const res = await addWishlistForUser(VillaId, user.uid);
        // console.log("Add wishlist", res);
        setsaved(true);
        toast.success("Successfully added to saved villa");
      } else {
        const res = await deleteWishlistForUser(VillaId, user.uid);
        // console.log("Delete wishlist", res);
        setsaved(false);
        toast("Removed saved villa");
      }
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    } else {
      toast.error("You are not logged in. Please login...");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setSaveLoading(true);
        const res = await fetchWishlistForUserPerVilla(VillaId);
        console.log("Fetch wishlist", res);
        if (res.success) {
          setsaved(true);
        }
        setSaveLoading(false);
      }
    };

    fetchData();
  }, [isLoading]);

  return (
    <div className="relative flex gap-6">
      <div>
        <button
          className="flex flex-col items-center text-xs"
          onClick={handleShareClick}
        >
          <GoShareAndroid size={24} />
          <p>Share</p>
        </button>

        {isShareMenuOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 drop-shadow-xl">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black opacity-20 z-40"
              onClick={() => setIsShareMenuOpen(false)}
            ></div>

            {/* Popup Container */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 px-10 z-50">
              <ul className="space-y-6 flex flex-col items-center">
                <li className="flex flex-col  md:flex-row hover:text-blue-600 transition-colors">
                  {/* <FaCopy /> */}
                  <textarea
                    className="w-72 md:w-64 overflow-x-scroll whitespace-nowrap h-8 display-no-scroll border border-gray-400 p-1  md:rounded-l-md text-gray-500 font-medium"
                    readOnly
                  >
                    {typeof window !== 'undefined' ? window.location.href : null}
                  </textarea>
                  <button onClick={handleCopyToClipboard} className="bg-gray-800 text-white py-1 md:py-0 px-4 md:rounded-r-md" >
                    <span>Copy url</span>
                  </button>
                </li>
                <ul className="flex justify-between gap-8 max-w-72">
                  {shareOptions.map((d, index) => (
                    <li key={index}>
                      <Link
                        href={d.url.replace("{URL}", typeof window !== 'undefined' ? window.location.href :  '/')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 hover:text-blue-600 transition-colors relative h-12 w-12 hover:drop-shadow-lg"
                      >
                        <Image
                          src={d.icon}
                          alt={d.name}
                          width={50}
                          height={50}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div>
        {saveLoading ? 
         (<button
          className="flex flex-col items-center text-xs transition-transform duration-200"
        > <BsFillHeartFill
          size={24}
          className={saveLoading ? "opacity-50" : (animate ? "transform scale-125" : "")}
        /> <p>Save</p> </button>) 
        : (<button
            className="flex flex-col items-center text-xs transition-transform duration-200"
            onClick={() => handleSave(!saved)}
            disabled={saveLoading} // Disable button while loading
          >
            {saved ? (<BsFillHeartFill
              size={24}
              color="red"
              className={saveLoading ? "opacity-50" : (animate ? "transform scale-125" : "")}
            />) : (<BsHeart
              size={24}
              className={saveLoading ? "opacity-50" : (animate ? "transform scale-125" : "")}
            />)}
            <p>Save</p>
          </button>) }
                      
      </div>
    </div>
  );
}

const shareOptions = [
  {
    name: "facebook",
    icon: "/share/facebook.svg",
    url: "https://www.facebook.com/sharer/sharer.php?u={URL}",
  },
  {
    name: "whatsapp",
    icon: "/share/whatsapp.svg",
    url: "https://api.whatsapp.com/send?text={URL}",
  },
  {
    name: "x.com",
    icon: "/share/x.svg",
    url: "https://x.com/intent/tweet?url={URL}",
  },
  {
    name: "mail",
    icon: "/share/mail.svg",
    url: "mailto:?subject=Check this out&body={URL}",
  },
];
