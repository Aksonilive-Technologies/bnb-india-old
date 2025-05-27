import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f7f7f7] text-[#000] w-full">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand & Description */}
        <div>
          <div className="flex items-end space-x-3">
            <Image src="/logo_white.png" alt="bnbIndia Logo" width={50} height={50} className="opacity-80" />
            <span className="text-xl font-bold">bnbIndia</span>
          </div>
          <p className="mt-3 text-[1rem] text-[#000]/70">Discover your world with bnbIndia: Where Every Stay is a Journey.</p>
          <p className="mt-2 text-[1rem] font-semibold">+91 91369 21160</p>
          <p className="text-[1rem] text-[#000]/70">admin@pinevillas.in</p>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-lg font-semibold">Legal</h3>
          <ul className="mt-3 space-y-1 sm:space-y-2 text-[1rem] text-[#000]/70">
            <li><Link href="/policies/privacyandpolicy" className="hover:text-[#000]">Privacy Policy</Link></li>
            <li><Link href="/policies/faqs" className="hover:text-[#000]">FAQs</Link></li>
            <li><Link href="/policies/termsAndConditions" className="hover:text-[#000]">Terms & Conditions</Link></li>
            <li><Link href="/documents/AA270824172755Q_RC12092024.pdf" className="hover:text-[#000]" target="_blank">GST Details</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold">Services</h3>
          <ul className="mt-3 space-y-1 sm:space-y-2 text-[1rem] text-[#000]/70">
            <li><Link href="/" className="hover:text-[#000]">Book Stays</Link></li>
            <li><Link href="/hostpanel/listings" className="hover:text-[#000]">Host Your Property</Link></li>
            <li><Link href="/hostpanel" className="hover:text-[#000]">Property Management</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-[1rem] font-semibold">Contact Us</h3>
          <div className="mt-4 flex space-x-4">
            <Link href="https://www.facebook.com/PineStaysOfficcial" target="_blank" className="text-[#000]/70 hover:text-[#000]">
              <FaFacebook size={28} />
            </Link>
            <Link href="https://www.instagram.com/pinestaysofficial/" target="_blank" className="text-[#000]/70 hover:text-[#000]">
              <FaInstagram size={28} />
            </Link>
          </div>

          <div className="text-[#000]/70 pt-4 text-sm">
            <p>Royal Heritage, Flat No. 906</p>
            <p>New DN Nagar, Behind Rustomjee Elements</p>
            <p>Juhu Circle, Mumbai Suburban</p>
            <p>Mumbai, Maharashtra - <span className="font-semibold">400053</span></p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#000]/10 mt-8 px-1 py-4 text-center text-[#000]/70 text-[0.65rem] sm:text-[1rem]">
        <p>
          © 2023 Pinestays. All Rights Reserved. | Developed by &nbsp;
          <Link href="https://codemonkey.co.in/" className="text-red-500 underline hover:text-[#000]" target="_blank">CodeMonkey</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
