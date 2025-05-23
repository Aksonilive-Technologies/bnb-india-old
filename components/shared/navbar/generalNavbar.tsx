'use client'
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import PlaceholderProfileMenu from './placeHolderProfileMenu';
import { IoMdArrowBack } from 'react-icons/io';

const ProfileMenu = dynamic(() => import('./ProfileMenu'), {
  ssr: false,
  loading: () => <PlaceholderProfileMenu />,
});


export default function Navbar(){
  
    return (
      <nav className="sticky top-0 z-40 bg-white shadow-sm py-2 px-4 flex justify-between items-center">
        <Link href={'/'} className="text-lg font-bold flex gap-2 items-center">
          <Image src={'/logo.png'} alt='logo' width={30} height={30} className='hidden sm:block'/>
          <div
          className="hover:bg-gray-200 px-2 py-1 rounded-lg block items-center sm:hidden"
          onClick={() => typeof window !== 'undefined' ? window.history.back() : null}
        >
          <IoMdArrowBack className="text-2xl cursor-pointer rounded-full transition-colors duration-300" />
        </div>
          <p className='sm:pt-3 pb-0'>bnbIndia</p>
        </Link>
        <ProfileMenu/>
      </nav>
    );
};