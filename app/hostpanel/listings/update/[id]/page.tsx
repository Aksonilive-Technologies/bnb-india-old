"use client";

import { useState, useEffect, useMemo } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { useRouter } from "next/navigation";
import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChangeCoverPic, connectImagestoListing, createInitialListing, getImagesById, getListingById, updateListing } from "@/actions/listing/listing.action";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { FaArrowLeft } from 'react-icons/fa';
import { Ammenity, PropertyCategory, DescriptionPage, MapLocation, PriceDetails, TitlePage, UploadImage, VillaDetails } from "./component";
import Image from "next/image";
import dynamic from "next/dynamic";

import { getAllAmmenities, getAllCategories } from "@/actions/listing/listing.action";

import DynamicHead from "@/components/DynamicHead";
import { useUserStore } from "@/store/store";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";



const UpdateListingForm: React.FC<{ params: { id: string } }> = ({ params }) => {

    const [amenities, setAmenities] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch amenities on component mount
    useEffect(() => {
        const fetchAmenitiesAndCategoriesData = async () => {
            try {
                const Amenitydata = await getAllAmmenities();
                const Categorydata = await getAllCategories();
                setAmenities(Amenitydata);
                setCategories(Categorydata);
            } catch (error) {
                console.error("Failed to fetch fetchAmenitiesAndCategoriesData:", error);
            }
        };

        fetchAmenitiesAndCategoriesData();
    }, []);

    const DynamicMap = useMemo(() => dynamic(
        () => import('@/components/Map'),
        {
            loading: () => <p>A map is loading...</p>,
            ssr: false
        }
    ), []);

    const Listing_id = params.id;
    const [formData, setFormData] = useState<any>({
        address: '',
        area_name: '',
        city: '',
        state: '',
        zipCode: 0,
        villaType: '',
        coordinate: [],

        numberOfBedrooms: 1,
        numberOfBeds: 1,
        numberOfBathrooms: 1,

        // second 
        title: '',
        images: '',
        description: '',
        amenity_name: [],

        // third
        maxGuests: 10,
        minGuests: 1,
        pricePerGuest: 100,
        pricePerDay: 2000,
        bookingType: "",
        cancellationType: "",
        family_only: false,
        bnbVerified: false,
        isListed: false,
    });


    const [initialData, setInitialData] = useState<any>({});
    const [Data, setData] = useState<any>({});
    // Function to compare and create an object with only the changed fields
    const getChangedData = (initial: any, current: any) => {
        const changedData: any = {};

        for (const key in current) {
            if (initial[key] !== current[key]) {
                changedData[key] = current[key];
            }
        }

        return changedData;
    };
    const [fecthing, setfecthing] = useState(true);
    const fetchListing = async () => {
        setfecthing(true);
        try {
            const data: any = await getListingById(Listing_id);
            const listing = data[0];
            // console.log("listing is ", listing);
            setData(listing)
            const updatedFormData
                = {
                address: listing.address || '',
                area_name: listing.area_name || '',
                city: listing.city || '',
                state: listing.state || '',
                zipCode: parseInt(listing.zipCode) || '',
                villaType: listing.villaType || '',
                coordinate:
                    listing?.latitude !== undefined && listing?.longitude !== undefined
                        ? [listing.latitude, listing.longitude]
                        : [],

                numberOfBedrooms: listing.numberOfBedrooms || 1,
                numberOfBeds: listing.numberOfBeds || 1,
                numberOfBathrooms: listing.numberOfBathrooms || 1,
                coverImage: listing.coverImage,
                // second
                title: listing.title || '',
                images: listing.images || '',
                description: listing.description || '',
                amenity_name: listing?.Amenities?.split(', ') || [],
                category_code: listing?.category?.split(', ') || [],

                // third
                maxGuests: listing.maxGuests || 10,
                minGuests: listing.minGuests || 1,
                pricePerGuest: listing.pricePerGuest || 100,
                pricePerDay: listing.pricePerDay || 2000,
                bookingType: listing.bookingType || '',
                cancellationType: listing.cancellationType || '',
                family_only: listing.family_only || false,
                bnbVerified: listing.bnbVerified || false,
                isListed: listing.isListed || false,
            };
            console.log("fecthed form data :", updatedFormData);

            const images: any = await getImagesById(Listing_id);

            setInitialCover(listing.coverImage)
            setImages(images);
            setProfilePic(listing.coverImage)
            setFormData(updatedFormData);
            setInitialData(updatedFormData);
        } catch (error) {
            console.error('Error fetching listing:', error);
        }
        setfecthing(false);
    };

    useEffect(() => {
        fetchListing();
    }, []);

    const UpdateOne = async () => {
        setLoading(true);

        setFormData((prev: any) => ({
            ...prev,
            zipCode: parseInt(prev.zipCode)
        }));

        const changedData = getChangedData(initialData, formData);
        if (changedData?.zipCode) {
            changedData.zipCode = parseInt(changedData.zipCode);
        }
        try {
            if (Object.keys(changedData).length > 0) {
                const response = await updateListing(Listing_id, changedData);
                console.log("Responase", response)
                if (response.success) {
                    setInitialData(formData);
                    toast.success("Data Saved Successfully")
                } else {
                    toast.error("Error not saving data")
                    console.error("Failed to update listing:", response.error);
                }
            } else {
                return { status: 201, data: "no Data to Update" }
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            return { status: 404, data: error }
        } finally {
            setLoading(false);
        }
    };



    const [images, setImages] = useState<any>([]);
    const [initialCover, setInitialCover] = useState<any>();

    const [loading, setLoading] = useState(false);
    const [Uploading, setUploding] = useState(false);

    const [profilePic, setProfilePic] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const router = useRouter();
    // Modularized function to handle image upload
    const uploadImages = async (images: any[], listingId: string) => {
        const uploadPromises = images.map((image: any, index: number) => {
            // Include the index in the storage reference to ensure uniqueness
            const storageRef = ref(storage, `${listingId}/images/${Date.now()}_${index}`);
            const uploadTask = uploadBytesResumable(storageRef, image.file);
            
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`${index + 1}: ${progress}% uploaded`);
                    },
                    (error) => {
                        console.error("Upload error: ", error);
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve({
                                image_url: downloadURL,
                                topImage: image.isCover || false,
                            });
                            console.log("Image uploaded successfully:", downloadURL);
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        });

        return Promise.all(uploadPromises);
    
    };

    const compressImageIfNeeded = async (imageFile: File) => {
        const targetSizeMB = 3; // Target size after compression (3MB)
        const maxWidthOrHeight = 1920; // Maintain good quality

        if (imageFile.size / (1024 * 1024) > targetSizeMB) {
            console.log(`Compressing ${imageFile.name} (Size: ${(imageFile.size / (1024 * 1024)).toFixed(2)} MB)`);

            // Adjust quality dynamically to reach around 3MB
            let quality = 0.8; // Start with high quality
            let compressedFile = imageFile;

            while (compressedFile.size / (1024 * 1024) > targetSizeMB && quality > 0.4) {
                try {
                    const options = {
                        maxSizeMB: targetSizeMB,
                        maxWidthOrHeight,
                        initialQuality: quality,
                        useWebWorker: true,
                    };

                    compressedFile = await imageCompression(imageFile, options);
                    quality -= 0.1; // Reduce quality slightly if still above 3MB
                } catch (error) {
                    console.error("Compression failed:", error);
                    return imageFile; // Return original if compression fails
                }
            }

            console.log(`Final compressed size: ${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB`);
            return compressedFile;
        }

        console.log(`Skipping compression for ${imageFile.name} (Size: ${(imageFile.size / (1024 * 1024)).toFixed(2)} MB)`);
        return imageFile;
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            let filesArray = Array.from(e.target.files);
            console.log("file array is ",filesArray);
            
            setIsUploading(true);
            try {
                const compressedFiles = await Promise.all(filesArray.map(async (file) => {
                    const compressedFile = await compressImageIfNeeded(file);
                    return { file: compressedFile, isCover: false };
                }));
                console.log("Final images for upload:", compressedFiles);
                const uploadedImages: any = await uploadImages(compressedFiles, Listing_id);
                console.log(uploadedImages);
                
                const result = await connectImagestoListing(uploadedImages, Listing_id);
                if (result?.success) {
                    const d: any = result.data;
                    setImages((prevImages: any) => [...prevImages, ...d]);
                    console.log("Images connected to listing successfully:", result);
                }
            } catch (error) {
                console.error("Image upload or linking failed:", error);
            } finally {
                setIsUploading(false);
                setUploadProgress(null);
            }
        }
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const truncatedDescription = (description: string, maxLength: number) => {
        const plainText = description.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return plainText.length > maxLength
            ? description.slice(0, maxLength) + "..."
            : description;
    };

    const hideRightPanelbelowWidt = 768  //i.e md in tailwind

    const handleStepClick = (step: any) => {
        setCurrentStep(step);
        if (typeof window !== 'undefined') {
            if (window.innerWidth < hideRightPanelbelowWidt) {
                setIsSidebarOpen(false);
            }
        }
    };
    const [error, setError] = useState<any>(null)
    const { user } = useUserStore();
    useEffect(() => {
        if (!Data || Data?.host_id !== user.user_id) {
            setError("You are not authorized");
            console.log(Data.host_id, user.user_id)
        } else {
            setError(null);
        }
    }, [Data])


    if (fecthing) {
        return (
            <SkeletonLoader isSidebarOpen={true} />
        )
    }
    if (error) {
        console.log(error);

        return (
            <div className="flex items-center justify-center h-[40vh]">{error}</div>
        );
    }

    return (


        <main className="m-auto min-h-[80vh]  mt-[5vh] px-2 lg:px-5 max-w-6xl space-y-10">
            <DynamicHead title={"HostPanel - Upddate Listing"} />



            <>
                <div className="w-full h-[80vh]  flex items-start md:items-center md:justify-between flex-row bg-white rounded-lg ">
                    <div
                        className={`h-full md:p-5 border-r border-gray-100 
        ${typeof window !== 'undefined' && window.innerWidth < 768 && !isSidebarOpen
                                ? 'hidden'
                                : 'px-3 sm:px-6 md:w-[400px]'
                            }`}
                    >

                        <p className="text-2xl font-bold mb-5">Listing Editor</p>
                        <div className="space-y-4 h-[80vh]  overflow-y-scroll custom-scroll p-3">
                            <div onClick={() => handleStepClick(3)}
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep == 3 ? 'border-pink-500 shadow-lg' : ''}`}>
                                <div className="flex flex-col items-start">
                                    <h3 className="text-lg font-semibold">Photo tour</h3>
                                    <p className="text-gray-500">{images.length} photos </p>
                                </div>
                                <div>
                                    {images.length > 0 && (
                                        <div className="relative mt-3">
                                            {/* First image - center */}
                                            {images.length > 2 && images[1] && (
                                                <div className="relative inset-0 flex items-center justify-center z-30">
                                                    <Image
                                                        src={formData.coverImage}
                                                        height={200}
                                                        width={200}
                                                        alt="Photo 2"
                                                        className="rounded-lg"
                                                        layout="fixed"
                                                        objectFit="cover"
                                                    />
                                                </div>
                                            )}


                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200   flex justify-between items-center ${currentStep == 1 ? 'border-pink-500 shadow-lg' : ''}`}
                                onClick={() => handleStepClick(1)}
                            >
                                <div>
                                    <p className="font-semibold">Title</p>
                                    <p className="font-bold text-xl text-gray-500">{initialData.title}</p>
                                    <p className=" text-md "> ID : {params.id} </p>
                                    {/* <p className="text-gray-500">{params.id}</p> */}



                                </div>




                            </div>

                            <div onClick={() => handleStepClick(2)}
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2  border-gray-200 ${currentStep === 2 ? 'border-pink-500 shadow-lg' : ''}`}
                            >
                                <p className="font-semibold ">Description</p>
                                <div
                                    className=" truncated-description max-h-72 overflow-hidden"
                                    dangerouslySetInnerHTML={{ __html: initialData.description }}
                                ></div>
                            </div>



                            <div onClick={() => handleStepClick(4)}
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep === 4 ? 'border-pink-500 shadow-lg' : ''}`}
                            >
                                <p className="font-semibold mb-2">Location</p>
                                <p className="font-semibold text-[15px] text-gray-500">
                                    {initialData.address}
                                </p>
                                <p className="font-semibold text-[15px] text-gray-500">
                                    {initialData.area_name}
                                </p>
                                <p className="font-semibold text-[15px] text-gray-500">
                                    {initialData.city} , {initialData.state}
                                </p>
                                <p className="font-semibold text-[15px] text-gray-500">

                                </p>
                                <p className="font-semibold text-[13px] text-gray-500">
                                    ZipCode: {initialData.zipCode}
                                </p>
                            </div>

                            <div
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep === 5 ? 'border-pink-500 shadow-lg' : ''}`}
                                onClick={() => handleStepClick(5)}
                            >
                                <p className="font-semibold mb-2 max-h-64 overflow-hidden">Ammenity</p>
                                {initialData.amenity_name.map((amenityId: any) => {
                                    const amenity = amenities.find((a: any) => a.amenity_name === amenityId);
                                    // console.log('Amenities:', amenities);
                                    // console.log('Amenity ID being searched:', amenityId);

                                    return amenity ? (
                                        <div
                                            key={amenity.id}
                                            className="flex items-center  p-1 text-gray-700 justify-left space-x-2 gap-2 cursor-pointer "
                                        >
                                            <button
                                                type="button"
                                                className="p-1  rounded-lg bg-transparent focus:outline-none"
                                            >
                                                <Image
                                                    src={amenity.amenity_image}
                                                    alt={amenity.label || "Amenity"}
                                                    width={32} // Set the width for the image
                                                    height={32} // Set the height for the image
                                                />
                                            </button>
                                            <span>{amenity.amenity_name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>

                            <div
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep === 6 ? 'border-pink-500 shadow-lg' : ''}`}
                                onClick={() => handleStepClick(6)}
                            >
                                <p className="font-semibold mb-2">Category</p>
                                {initialData.category_code.map((categoryId: any) => {
                                    const category = categories.find((a: any) => a.category_code === categoryId);
                                    // console.log('Amenities:', categories);
                                    // console.log('Amenity ID being searched:', categoryId);

                                    return categories ? (
                                        <div
                                            key={category?.id}
                                            className="flex items-center  p-1 text-gray-700 justify-left space-x-2 gap-2 cursor-pointer "
                                        >
                                            <button
                                                type="button"
                                                className="p-1  rounded-lg bg-transparent focus:outline-none"
                                            >
                                                <Image
                                                    src={category?.category_image}
                                                    alt={category?.category_name || "category"}
                                                    width={32} // Set the width for the image
                                                    height={32} // Set the height for the image
                                                />
                                            </button>
                                            <span>{category?.category_name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>

                            <div onClick={() => handleStepClick(8)}
                                className={`p-4 rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep == 8 ? 'border-pink-500 shadow-lg' : ''}`}
                            >
                                <p className="font-semibold mb-2">Price Details</p>
                                <p className="text-gray-500">
                                    Adjust the pricing details for your villa to match your preferences.</p>
                            </div>
                            <div onClick={() => handleStepClick(7)}
                                className={` p-4  rounded-lg shadow-[rgba(17,17,26,0.1)_0px_0px_16px] border-2 border-gray-200 ${currentStep == 7 ? 'border-pink-500 shadow-lg' : ''}`}
                            >
                                <p className="font-semibold mb-2">Basic Details</p>
                                <p className="text-gray-500">
                                    <span className="font-medium ">
                                        {initialData.numberOfBeds ? initialData.numberOfBeds : 1} Bed{initialData.numberOfBeds > 1 ? 's' : ''}
                                    </span> ·
                                    <span className="font-medium">
                                        {initialData.numberOfBathrooms ? initialData.numberOfBathrooms : 1}   Bathroom{initialData.numberOfBathrooms > 1 ? 's' : ''}
                                    </span> ·
                                    <span className="font-medium">{initialData.numberOfBedrooms || 1} Bedroom{initialData.numberOfBedrooms > 1 ? 's' : ''}</span></p>

                            </div>

                            <div className="h-10">

                            </div>

                        </div>
                    </div>

                    {/* Right side with editing options */}
                    <div className="hidden md:flex md:w-[70%] h-full overflow-y-scroll custom-scroll ">

                        <div className="no-scrollbar w-[90%] mx-auto h-full rounded-lg ">
                            <SwitchTransition mode="out-in">
                                <CSSTransition
                                    key={currentStep}
                                    timeout={300}
                                    classNames="step"
                                    unmountOnExit
                                    mountOnEnter
                                >
                                    <div>
                                        {currentStep === 4 && <MapLocation formData={formData} setFormData={setFormData} />}
                                        {currentStep === 5 && <Ammenity formData={formData} setFormData={setFormData} />}
                                        {currentStep === 6 && <PropertyCategory formData={formData} setFormData={setFormData} />}
                                        {currentStep === 1 && <TitlePage formData={formData} setFormData={setFormData} />}
                                        {currentStep === 2 && <DescriptionPage VillaDescription={formData.description} setVillaDescription={setFormData} />}
                                        {currentStep === 3 &&
                                            <UploadImage
                                                handleImageChange={handleImageChange}
                                                images={images}
                                                setUploading={setIsUploading}
                                                setImages={setImages}
                                                isUploading={isUploading}
                                                profilePic={profilePic}
                                                setProfilePic={setProfilePic}

                                            />}
                                        {currentStep === 7 && <VillaDetails formData={formData} setFormData={setFormData} />}
                                        {currentStep === 8 && <PriceDetails formData={formData} setFormData={setFormData} />}
                                    </div>
                                </CSSTransition>
                            </SwitchTransition>
                        </div>
                    </div>
                    {
                        !isSidebarOpen &&
                        <div className="flex flex-col md:hidden w-full h-full overflow-scroll no-scrollbar  ">
                            <div className="flex items-center justify-around space-x-2 w-[70px] p-2 rounded-full bg-gray-100 hover:border-pink-500 hover:text-pink-500 hover:bg-white border-[1px] mb-5 cursor-pointer"

                                onClick={() => { setIsSidebarOpen(true) }}>
                                <FaArrowLeft />
                                <span className="font-semibold">Back</span>
                            </div>
                            <div className="no-scrollbar h-full rounded-lg ">
                                <SwitchTransition mode="out-in">
                                    <CSSTransition
                                        key={currentStep}
                                        timeout={300}
                                        classNames="step"
                                        unmountOnExit
                                        mountOnEnter
                                    >
                                        <div>

                                            {currentStep === 4 && <MapLocation formData={formData} setFormData={setFormData} />}

                                            {currentStep === 5 && <Ammenity formData={formData} setFormData={setFormData} />}
                                            {currentStep === 6 && <PropertyCategory formData={formData} setFormData={setFormData} />}
                                            {currentStep === 1 && <TitlePage formData={formData} setFormData={setFormData} />}
                                            {currentStep === 2 &&
                                                <DescriptionPage VillaDescription={formData} setVillaDescription={setFormData}
                                                />}
                                            {currentStep === 3 &&
                                                <UploadImage
                                                    handleImageChange={handleImageChange}
                                                    images={images}
                                                    setUploading={setIsUploading}
                                                    setImages={setImages}
                                                    isUploading={isUploading}
                                                    profilePic={profilePic}
                                                    setProfilePic={setProfilePic}

                                                />}
                                            {currentStep === 7 &&
                                                <VillaDetails formData={formData} setFormData={setFormData} />
                                            }
                                            {currentStep === 8 && <PriceDetails formData={formData} setFormData={setFormData} />}
                                        </div>
                                    </CSSTransition>
                                </SwitchTransition>
                            </div>
                        </div>
                    }
                </div>
                <div className="fixed bottom-0  right-0  flex items-center gap-6 justify-between p-5  z-50">
                    <button
                        onClick={async (e: any) => {
                            if (!loading) {
                                // if (images.length > 0) {
                                //     await handleUploadImages();
                                // }

                                await UpdateOne();

                            }
                        }}
                        className={`px-4 py-2 rounded-md focus:outline-none flex items-center justify-center transition-colors duration-300 ${loading ? 'red-gradient text-white cursor-wait' : 'bg-gray-200 text-gray-700 hover:red-gradient hover:text-white'}`}
                        disabled={loading || Uploading}
                    >
                        {loading || Uploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Saving
                            </>
                        ) : 'Save'}
                    </button>

                    <Link
                        href={`/details/${params.id}`}
                        className="px-4 py-2 rounded-md focus:outline-none flex items-center justify-center transition-colors duration-300 bg-gray-200 text-gray-700 hover:red-gradient hover:text-white"
                    >
                        View as User
                    </Link>

                </div>
            </>
        </main >
    );
};

export default UpdateListingForm;





const SkeletonLoader = ({ isSidebarOpen }: any) => {
    return (
        <div className="w-full h-[85vh] flex flex-col md:flex-row bg-gray-100 rounded-lg animate-pulse">
            {/* Left Side Skeleton */}
            <div className="h-full md:w-[350px] w-full p-5 border-r border-gray-200">
                <div className="h-8 w-1/2 bg-gray-300 rounded mb-5"></div>
                <div className="space-y-4 overflow-hidden h-[70vh] p-3">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-gray-200">
                            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side Skeleton (Only visible on larger screens) */}
            <div className="hidden md:flex flex-1 h-full items-center justify-center">
                <div className="w-3/4">
                    <div className="h-8 w-full bg-gray-300 rounded mb-5"></div>
                    <div className="h-6 w-1/2 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                </div>
            </div>

            {/* Mobile Sidebar Skeleton */}
            {!isSidebarOpen && (
                <div className="md:hidden w-full p-5">
                    <div className="h-8 w-1/4 bg-gray-300 rounded mb-5 mx-auto"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-gray-200">
                                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button Skeleton */}
            <div className="fixed bottom-0 right-0 p-5">
                <div className="h-10 w-24 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};


