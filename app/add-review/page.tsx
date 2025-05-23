'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import ReviewQuestionSection from './ReviewQuestionSection';
import StarsSection from './StarsSection';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';


import {addVillaReview, getListingByIdForReviewPage} from '@/actions/review/review.action'

interface ListingData {
  count: number | string;
  listing_id: string;
  review_total: number;
  title: string;
  topImage: boolean;
}


const ReviewPage = () => {

  const router = useRouter();

  const searchParams = useSearchParams();
  const villa_id = searchParams?.get('villaId');
  const booking_id = searchParams?.get('bookingId');

  const [cleanliness, setCleanliness] = useState<number | null>(null);
  const [communication, setCommunication] = useState<number | null>(null);
  const [houserules, setHouserules] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [stayAgain, setStayAgain] = useState<boolean>(false);
  const [showReviewQuestions, setShowReviewQuestions] = useState<boolean>();
  const [topBannerData, setTopBannerData] = useState<ListingData[]>([]);



  const [formData, setFormData] = useState<{
    cleanliness: number | null;
    communication: number | null;
    houserules: number | null;
    description: string;
    title: string;
    stayAgain: boolean;
  }>({
    cleanliness: null,
    communication: null,
    houserules: null,
    description: '',
    title: '',
    stayAgain: false,
  });

  useEffect(() => {
    if (villa_id) {
      const fetchTopBannerData = async () => {
        try {
          const data: ListingData[] = await getListingByIdForReviewPage(villa_id);
          setTopBannerData(data);
          // console.log({ topBannerData: data });
          // console.log("Count : ",data[0]?.count)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchTopBannerData();
    }
  }, [villa_id]);
  
  
  

  const handleCleanlinessClick = (value: number) => {
    setFormData((prevData) => ({ ...prevData, cleanliness: value }));
  };
  
  const handleCommunicationClick = (value: number) => {
    setFormData((prevData) => ({ ...prevData, communication: value }));
  };
  
  const handleHouserulesClick = (value: number) => {
    setFormData((prevData) => ({ ...prevData, houserules: value }));
  };
  
  const handleDescriptionChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, description: value }));
  };
  
  const handleStayAgainChange = (value: boolean) => {
    setFormData((prevData) => ({ ...prevData, stayAgain: value }));
  };

  if (!villa_id || !booking_id) {
    // Redirect or handle missing parameters
    console.error("Missing required parameters: villaId or bookingId.");
    // Example: Redirect to an error page or home
    return false;
  }
  
  const handleSubmit = async () => {
    console.log({formData});
    const res = await addVillaReview(formData, villa_id, booking_id)
    if(res?.success){
      router.push('/profile/mybookings')
    }
  };
  

  const handleNext = () => {
    setShowReviewQuestions(true);
  };

  const handlePrevious = () => {
    setShowReviewQuestions(false);
  };

  if (!topBannerData.length) {
    return <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <Image
          alt="villa image"
          src="/loading.gif"
          width={100}
          height={100}
      />
    </div>
  }

  return (
    <div className="flex flex-col items-center mx-auto p-8 bg-gray-100">
      <div className="w-full mx-5 max-w-screen-2xl">
        {/* Top part */}
        <div className='bg-white p-5 my-5 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center'>
          <h1 className="text-2xl font-bold mb-4">Rating & Review</h1>
          <div className='flex flex-row-reverse md:flex-row  flex-wrap'>
            <div className='mx-5'>
              <h1>{topBannerData[0]?.title}</h1>
              <p className="bg-green-700 inline-block text-white px-2 rounded-sm">{topBannerData[0]?.review_total}★</p> ({topBannerData[0]?.count})
            </div>
            <div>
              <Image alt="villa image" src="https://a0.muscache.com/im/pictures/miso/Hosting-868531502198922106/original/7d405524-b2ba-409f-a474-a88082d476e7.jpeg?im_w=1200" 
              width={50} height={50} className="object-cover w-full h-full"/>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row h-auto'>
          {/* Left section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 h-full md:max-w-96">
            <h2 className="text-lg font-bold mb-2">What makes a good review</h2>
            <hr />
            <br />
            <p className="mb-1 text-lg font-semibold">Have you stayed in our villa?</p>
            <p className="mb-2 text-sm">Your review should be about your experience of the stays.</p>
            <hr />
            <br />
            <p className="mb-1 text-lg font-semibold">Why review a villa?</p>
            <p className="mb-2 text-sm">Your valuable feedback will help fellow users decide!</p>
            <hr />
            <br />
            <p className="mb-1 text-lg font-semibold">How to review a product?</p>
            <p className="mb-2 text-sm">Your review should include facts. An honest opinion is always appreciated. If you have an issue with the villa or service please contact us from the help centre.</p>
          </div>

          <div className='w-full md:ml-10'>
            {!showReviewQuestions ? (
              <StarsSection
              cleanliness={formData.cleanliness}
              onCleanlinessClick={handleCleanlinessClick}
              communication={formData.communication}
              onCommunicationClick={handleCommunicationClick}
              houserules={formData.houserules}
              onHouserulesClick={handleHouserulesClick}
              onNext={handleNext}
            />
            ) : (
              <ReviewQuestionSection
              description={formData.description}
              onDescriptionChange={handleDescriptionChange}
              stayAgain={formData.stayAgain}
              onStayAgainChange={handleStayAgainChange}
              onSubmit={handleSubmit}
              onPrevious={handlePrevious}
            />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export default ReviewPage;


export default function Review() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewPage />
    </Suspense>
  );
}
