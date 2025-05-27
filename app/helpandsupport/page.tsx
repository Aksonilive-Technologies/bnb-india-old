"use client";

import Link from "next/link";

import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import {
  IoCopyOutline,
  IoMailOpenOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { RiCustomerService2Line } from "react-icons/ri";

import DynamicHead from "@/components/DynamicHead";

import Navbar from "@/components/shared/navbar/generalNavbar";

export default function HelpAndSupportPage() {
  function copyText(texttocopy: string) {
    const el = document.createElement("input");
    el.value = texttocopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast.success("Number successfully copied to clipboard");
  }

  const phone_number = "9136921160";
  const whatsapp_number = "9136921160";
  const support_email = "admin@pinevillas.in";

  return (
    <div>
      <div className="flex flex-col justify-between min-h-[100vh] text-center">
        <DynamicHead title={"Help & Support"} />
        <Navbar />
        <div className="flex flex-col p-4 min-h-[90vh] lg:px-20 justify-center items-center">
          <p className="text-lg font-semibold">Help and Support</p>
          <p className="mt-3 lg:mt-6 text-xl font-bold">
            Got Queries? Lets connect
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-10 p-2">
            <div className="w-full h-80 flex flex-col justify-center items-center p-4">
              <RiCustomerService2Line className="text-blue-300 size-28" />
              <p className="text-lg font-bold text-blue-300">
                24/7 customer care
              </p>
              <p className="text-sm">Always Here, Always Ready.</p>
              <button
                className="text-xl p-2 font-bold flex gap-2 items-center"
                onClick={() => copyText(phone_number)}
              >
                <p>+91 {phone_number}</p> <IoCopyOutline />
              </button>
              <Link
                href={`tel: +91${phone_number}`}
                target="_blank"
                className="font-bold text-blue-300"
              >
                call now
              </Link>
            </div>
            <div className="w-full flex flex-col justify-center items-center p-4">
              <FaWhatsapp className="text-green-500 size-28" />
              <p className="text-lg font-bold text-blue-300">
                chat with us on WhatsApp
              </p>
              <p className="text-sm">Your Questions Answered in Real-Time</p>
              <Link
                href={`https://wa.me/91${whatsapp_number}`}
                target="_blank"
                className="text-xl p-2 font-bold flex gap-2 items-center"
              >
                <p className="hover:text-green-600">+91 {whatsapp_number}</p>{" "}
                <IoPaperPlaneOutline />
              </Link>
            </div>
            <div className="w-full h-80 flex flex-col justify-center items-center p-4">
              <IoMailOpenOutline className="text-blue-300 size-28" />
              <p className="text-lg font-bold text-blue-300">send us a mail</p>
              <p className="text-sm">Reach Out to Us Via E-Mail</p>
              <Link
                href={`mailto: ${support_email}`}
                target="_blank"
                className="text-xl p-2 font-bold flex gap-2 items-center"
              >
                <p className="hover:text-blue-300">{support_email}</p>
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 font-semibold">
            Welcome to our Help and Support page! We&apos;re here to assist you
            24/7 with any questions or issues you may have. Whether you need
            help with a product, have a billing inquiry, or need technical
            support, our dedicated team is ready to provide prompt and efficient
            assistance. Connect with us via chat, email, or phone, and
            we&apos;ll ensure you get the support you need. Your satisfaction is
            our top priority.
          </p>
        </div>
      </div>
        
    </div>
  );
}
