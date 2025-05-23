'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import ShareNlike from "../../components/shareNLike";
import { getImagesForVilla } from "@/actions/listing/listing.action";

interface VillaImage {
  villaImage_uid: string;
  image_url: string;
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [images, setImages] = useState<VillaImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages: VillaImage[] | null = await getImagesForVilla(id);
      setImages(fetchedImages ?? []); // Ensures fallback is an empty array
    };
    fetchImages();
  }, [id]);

  const openPopup = (imageId: string, index: number) => {
    setSelectedImage(imageId);
    setCurrentIndex(index);
  };

  const closePopup = () => setSelectedImage(null);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(images[currentIndex + 1].villaImage_uid);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(images[currentIndex - 1].villaImage_uid);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col items-center p-4">
      {/* Back Button */}
      <div className="flex w-[98%] mt-2 xl:w-[80%] flex-row items-center justify-between mb-4">
        <div
          className="hover:bg-gray-200 px-2 py-1 rounded-lg flex items-center"
          onClick={() => typeof window !== 'undefined' ? window.history.back() : null}
        >
          <IoMdArrowBack className="text-xl cursor-pointer rounded-full transition-colors duration-300" />
          <span className="ml-1 cursor-pointer rounded p-1 transition-colors duration-300">Back</span>
        </div>
        <ShareNlike VillaId={id} />
      </div>

      {/* Image Grid */}
      <div className="grid w-[98%] xl:w-[80%] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
        {images.map((image, index) => (
          <div
            key={image.villaImage_uid}
            className={`relative overflow-hidden cursor-pointer rounded-lg shadow-lg ${
              index % 3 === 0 ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => openPopup(image.villaImage_uid, index)}
          >
            <Image
              alt={`image ${image.villaImage_uid}`}
              src={image.image_url}
              width={600}
              height={600}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50"
          onClick={closePopup}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <IoMdClose
              className="absolute top-4 right-4 text-white cursor-pointer text-3xl font-bold z-50"
              onClick={closePopup}
            />

            {/* Previous Button */}
            <button
              className="absolute left-4 p-2 bg-black bg-opacity-50 rounded-full text-white text-4xl cursor-pointer z-50"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentIndex === 0}
            >
              <FiChevronLeft />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              <Image
                src={images[currentIndex].image_url}
                alt={`Image ${selectedImage}`}
                fill={true}
                style={{ objectFit: "contain" }}
                className="transition-transform duration-300"
              />
            </div>

            {/* Next Button */}
            <button
              className="absolute right-4 p-2 bg-black bg-opacity-50 rounded-full text-white text-4xl cursor-pointer z-50"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex === images.length - 1}
            >
              <FiChevronRight />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 text-white text-lg bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}