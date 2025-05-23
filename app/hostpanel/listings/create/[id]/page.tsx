"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { connectImagestoListing, getImagesById, getListingById, setCoverPic, updateListing } from "@/actions/listing/listing.action";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import imageCompression from "browser-image-compression";
import {
    createListingSchema,
    createListingType,
} from "@/actions/listing/validations";


import { Address, Ammenity, PropertyCategory, Congo, DescriptionPage, Introduction, MapLocation, OtherDetails, PricePerDay, PricePerGuest, StatusBar, StepOne, StepThree, StepTwo, TitlePage, TypeOfReservations, TypeOfCancellation, TypeOfVilla, UploadImage, VillaDetails } from "../components";


const CompleteListingForm: React.FC<{ params: { id: string } }> = ({ params }) => {

    const Listing_id = params.id;
    const searchParams = useSearchParams();
    // console.log(searchParams);

    const step = searchParams?.get("step") ?? null;

    const [currentStep, setCurrentStep] = useState(7);
    const maxTiles = 17;
    const secondStart = 7;
    const thirdStart = 13;
    useEffect(() => {
        if (step) {
            // const stepNumber = parseInt(step, 10);
            setCurrentStep(thirdStart)
        }
    }, [step]);
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
        category_code: [],

        // third
        coverImage: "",
        maxGuests: 10,
        minGuests: 1,
        pricePerGuest: 100,
        pricePerDay: 2000,
        bookingType: "INSTANT",
        cancellationType: "",
        family_only: false,
        bnbVerified: false,
        isListed: false,
    });

    const [initialData, setInitialData] = useState<any>({});
    const [isDataValid, setIsDataValid] = useState(true);

    const isDataValidRef = useRef(isDataValid);

// Sync the ref with the state
useEffect(() => {
  isDataValidRef.current = isDataValid;
}, [isDataValid]);

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

    const fetchListing = async () => {
        try {
            const d: any = await getListingById(Listing_id);
            const listing: any = d[0];
            // console.log("listing is ", listing);

            const updatedFormData = {
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

                // second
                title: listing.title || '',
                images: listing.images || '',
                description: listing.description || '',
                amenity_name: listing?.Amenities?.split(', ') || [],

                // third
                coverImage: listing.coverImage || '',
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
            console.log("fethced  listing is  :", updatedFormData);

            const images: any = await getImagesById(Listing_id);
            // console.log("all images is", images);
            const profile = images.find((img: any) => img.topImage === true);
            setInitialCover(profile)
            setImages(images);
            // setVillaDescription(listing.description);
            setFormData(updatedFormData);
            setInitialData(updatedFormData);
        } catch (error) {
            console.error('Error fetching listing:', error);
        }
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
        changedData.pricePerGuest = formData.pricePerGuest;
        changedData.pricePerDay = formData.pricePerDay;
        console.log("changed Data is ", changedData, formData);
        try {
            if (Object.keys(changedData).length > 0) {
                const response = await updateListing(Listing_id, changedData);
                if (response.success) {
                    // console.log("Listing updated successfully:", response.updated_listing_id);
                    setInitialData(formData);
                    return { status: 200, data: response.updated_listing_id }
                } else {
                    console.error("Failed to update listing:", response.error);
                    return { status: 404, data: response.error }
                }
            } else {
                // console.log("No changes detected, nothing to update.");
                return { status: 201, data: "no Data to Update" }
            }
        } catch (error) {
            console.error("Error updating listing:", error);
            return { status: 404, data: error }
        } finally {
            setLoading(false);
        }
    };


    // image upload part  ---------------------------

    const [images, setImages] = useState<any>([]);
    const [initialCover, setInitialCover] = useState<any>();

    const [loading, setLoading] = useState(false);
    const [Uploading, setUploding] = useState(false);

    const [profilePic, setProfilePic] = useState<string | null>(null);
    // const [uploadImage, setUploadImage] = useState<any>([]);

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
    
    const handleUploadImages = async () => {
        setUploding(true);
        try {
            console.log("Uploading images: ", images);
            console.log("Selected cover image: ", profilePic);
    
            // Filter images excluding profile pic
            const uploadImage = images.filter((img: any) => img.image_url !== profilePic);
    
            console.log("Uploading images: ", uploadImage);
    
            let uploadedImages = [];
    
            const uploadPromises = uploadImage.map(async (image: any, index: number) => {
                const fileToUpload = await compressImageIfNeeded(image.file);
                const storageRef = ref(storage, `${Listing_id}/images/${index}`);
                const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    
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
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref)
                                .then((downloadURL) => {
                                    resolve({ image_url: downloadURL });
                                })
                                .catch(reject);
                        }
                    );
                });
            });
    
            uploadedImages = await Promise.all(uploadPromises);
            console.log("All images uploaded: ", uploadedImages);
    
            // Upload the profile picture
            const profilePicObject = images.find((img: any) => img.image_url === profilePic);
            const fileToUpload = await compressImageIfNeeded(profilePicObject.file);
            const storageRef = ref(storage, `${Listing_id}/cover`);
            const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    
            const profilePicURL = await new Promise<string>((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Profile picture: ${progress}% uploaded`);
                    },
                    (error) => {
                        console.error("Profile picture upload error: ", error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then(resolve)
                            .catch(reject);
                    }
                );
            });
    
            uploadedImages.push({ image_url: profilePicURL });
    
            const result = await connectImagestoListing(uploadedImages, Listing_id);
            if (!result.success) {
                throw new Error("Failed to connect images to listing");
            }
            console.log("Profile picture uploaded: ", profilePicURL);
    
            const coverResult = await setCoverPic(Listing_id, profilePicURL);
            if (coverResult.success) {
                console.log("Cover image updated successfully");
                setFormData((prevFormData: any) => ({
                    ...prevFormData,
                    coverImage: profilePicURL,
                }));
            } else {
                throw new Error("Failed to set cover image");
            }
        } catch (error) {
            console.error("Error during image upload or cover image update: ", error);
        } finally {
            setUploding(false);
        }
    };



    const router = useRouter();




    // -----------------



    const scrollToNext = async () => {
        // console.log(formData)
        const changedData = getChangedData(initialData, formData);
        console.log(changedData);
        console.log("Is Data Valid in Next", isDataValidRef.current)

        if(!isDataValidRef.current){
            alert("Please enter correct details")   
            return;
        }

        if (currentStep === thirdStart - 1) {

            if (!Array.isArray(formData.category_code) || formData.category_code.length === 0) {
                alert("Please select a category")  
                return;
            }

            if (!Array.isArray(formData.amenity_name) || formData.amenity_name.length === 1) {
                alert("Please select a ammenity")  
                return;
            } 

            if(!formData.title){
                alert("Please enter a title to your villa")  
                return;
            }

            if(!formData.description){
                alert("Please enter a description for your villa")  
                return;
            }

        }


        if (currentStep === thirdStart - 1) {

            const response: any = await UpdateOne();
            console.log(response);

            await handleUploadImages();
            router.push(`${window?.location.pathname}?step=3`);
            setCurrentStep(currentStep + 1)

        }

        else if (currentStep === maxTiles || currentStep === secondStart - 1) {
            const response: any = await UpdateOne();
            console.log(response);
            if (response.status === 200) {
                if (currentStep === maxTiles) {
                    router.push('/hostpanel/listings/create/confirmlisting')
                }
                setCurrentStep(currentStep + 1)
            }
        }
        else if (currentStep < maxTiles) {
            setCurrentStep(currentStep + 1);
        }
    };

    const scrollToPrevious = () => {
        setIsDataValid(true)
        console.log("Is Data Valid in Previous", isDataValidRef.current)
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };


    return (

        <main className="m-auto  min-h-[90vh] mt-[5vh] px-5 max-w-5xl space-y-10">

            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={currentStep}
                    timeout={300}
                    classNames="step"
                    unmountOnExit
                    mountOnEnter
                >
                    <div>

                        {currentStep === 1 && <Introduction />}
                        {currentStep === 2 && <StepOne />}
                        {currentStep === 3 && <TypeOfVilla formData={formData} setFormData={setFormData} />}
                        {currentStep === 4 && <MapLocation formData={formData} setFormData={setFormData} />}
                        {currentStep === 5 && <Address formData={formData} setFormData={setFormData} />}
                        {currentStep === 6 && <VillaDetails formData={formData} setFormData={setFormData} />}


                        {currentStep === 7 && <StepTwo />}
                        {currentStep === 8 && <PropertyCategory formData={formData} setFormData={setFormData} setIsDataValid={setIsDataValid} />}
                        {currentStep === 9 && <Ammenity formData={formData} setFormData={setFormData} setIsDataValid={setIsDataValid} />}
                        {currentStep === 10 && <TitlePage formData={formData} setFormData={setFormData} setIsDataValid={setIsDataValid} />}
                        {
                            currentStep === 11
                            &&
                            <DescriptionPage
                                VillaDescription={formData.description}
                                setVillaDescription={setFormData}
                                setIsDataValid={setIsDataValid}
                            />
                        }
                        {currentStep === 12 &&
                            <UploadImage
                                images={images}
                                setImages={setImages}
                                // uploadImage={uploadImage}
                                // setUploadImage={setUploadImage}
                                profilePic={profilePic}
                                setProfilePic={setProfilePic}

                            />}
                        {currentStep === 13 && <StepThree />}


                        {currentStep === 14 && <TypeOfReservations formData={formData} setFormData={setFormData} />}
                        {currentStep === 15 && <TypeOfCancellation formData={formData} setFormData={setFormData} />}
                        {currentStep === 16 && <PricePerDay formData={formData} setFormData={setFormData} />}
                        {currentStep === 17 && <PricePerGuest formData={formData} setFormData={setFormData} />}
                        {currentStep === 18 && <OtherDetails formData={formData} setFormData={setFormData} />}
                        {/* {currentStep === 18 && <Congo formData={formData} setFormData={setFormData} />} */}
                    </div>
                </CSSTransition>
            </SwitchTransition>

            <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center gap-6 justify-between p-5 shadow-md">
                <button
                    onClick={scrollToPrevious}
                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none ${currentStep === 1 || currentStep == secondStart || currentStep == thirdStart ? 'invisible' : ''}`}
                >
                    Previous
                </button>
                {currentStep > 1 && <StatusBar currentStep={currentStep} totalSteps={maxTiles} />}
                <button
                    onClick={(e: any) => {
                        if (!loading) {
                            scrollToNext()
                        }
                    }}
                    className={`px-4 py-2 rounded-md focus:outline-none flex items-center justify-center transition-colors duration-300 ${loading ? 'red-gradient text-white cursor-wait' : 'bg-gray-200 text-gray-700 hover:red-gradient hover:text-white'
                        } ${(currentStep === 12 && (images.length + images.length < 5 || !profilePic)) ? 'invisible' : ''}`}
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
                    ) : currentStep === 1 ? 'Get Started' : currentStep === secondStart - 1 ? 'Initialize' : 'Next'}
                </button>
            </div>

        </main>
    );
};

export default CompleteListingForm;



