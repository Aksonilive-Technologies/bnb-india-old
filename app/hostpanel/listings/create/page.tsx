"use client";

import { useEffect, useState } from "react";
import { EditorState } from "draft-js";
import { useRouter } from "next/navigation";

import { createInitialListing } from "@/actions/listing/listing.action";
import { motion, AnimatePresence } from "framer-motion";
import {
    createListingSchema,
    createListingType,
} from "@/actions/listing/validations";
import { Address, Introduction, MapLocation, StatusBar, StepOne, VillaDetails } from "./components";
import DynamicHead from "@/components/DynamicHead";
import { isBankDetailsAvailable } from "@/actions/users.actions";
import toast from "react-hot-toast";

const NewListingForm = () => {

    const [formData, setFormData] = useState<any>({
        address: '',
        area_name: '',
        city: '',
        state: '',
        zipCode: "",
        villaType: '',
        coordinate: [],
        numberOfBedrooms: 1,
        numberOfBeds: 1,
        numberOfBathrooms: 1,
        title: 'Tanmay',
        images: '',
        description: '',
        amenity_name: [],
        maxGuests: 10,
        minGuests: 1,
        pricePerGuest: 100,
        pricePerDay: 2000,
        bookingType: "",
        family_only: false,
        bnbVerified: false, // keep it by default false
        isListed: false,
    });
    const checkBankDetials = async () => {
        const response = await isBankDetailsAvailable();
        // if (response.success) {
        if (true) {
            console.log("Bank details found");
        }
        else {
            toast.error("Please add bank details first");
            router.push("/hostpanel/bankDetails?redirect=/hostpanel/listings/create");
        }
    };
    useEffect(() => {
        checkBankDetials();
    }, []);
    // const [VillaDescription, setVillaDescription] = useState<any>(EditorState.createEmpty());
    // const [coordinate, setCoordinates] = useState<[number, number]>([20.5937, 78.9629]);
    const [images, setImages] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const initialSubmit = async () => {
        setLoading(true);
        if (
            !Array.isArray(formData.coordinate) || 
            formData.coordinate.length < 2 || 
            typeof formData.coordinate[0] !== 'number' || 
            typeof formData.coordinate[1] !== 'number'
          ) {
                alert("Fill choose a location in maps");
                setLoading(false);
                return { error: "Location not chosen" };
          }
          

        const data: createListingType = {
            villaType: "villa",
            latitude: formData.coordinate?.[0].toFixed(6),
            longitude: formData.coordinate?.[1].toFixed(6),
            address: formData.address,
            city: formData.city,
            area_name: formData.area_name,
            state: formData.state,
            zipCode: parseInt(formData.zipCode),
            numberOfBedrooms: parseInt(formData.numberOfBedrooms),
            numberOfBathrooms: parseInt(formData.numberOfBathrooms),
            numberOfBeds: parseInt(formData.numberOfBeds),
        };
        console.log("inital submit data is ", data);

        const validatedFields = createListingSchema.safeParse(data);
        if (!validatedFields.success) {
            alert("Fill all the designated fields");
            setLoading(false);
            return { error: "Invalid fields" };
        }

        try {
            const response = await createInitialListing(data);
            console.log("response", response);

            if (response.success) {
                router.push(`/hostpanel/listings/create/${response.listing_id}`);
            } else {
                console.error("Failed to create listing:", response.error);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error creating listing:", error);
        }
    };

    const [currentStep, setCurrentStep] = useState(1);
    const maxTiles = 16;
    const secondStart = 6;
    // const thirdStart = 11;

    const scrollToNext = async () => {
        // console.log(formData);

        if (currentStep === secondStart - 1) {
            await initialSubmit();
        }
        else if (currentStep < maxTiles) {
            setCurrentStep(currentStep + 1);
        }
    };

    const scrollToPrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <main className="m-auto min-h-[90vh] mt-[5vh] px-5 max-w-5xl space-y-10">
            <DynamicHead title={"HostPanel - Create Listings"} />
            <AnimatePresence>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        {currentStep === 1 && <Introduction />}
                        {currentStep === 2 && <StepOne />}
                        {/* {currentStep === 3 && <TypeOfVilla formData={formData} setFormData={setFormData} />} */}
                        {currentStep === 3 && <MapLocation
                            formData={formData} setFormData={setFormData}
                        />}
                        {currentStep === 4 && <Address formData={formData} setFormData={setFormData} />}
                        {currentStep === 5 && <VillaDetails formData={formData} setFormData={setFormData} />}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center gap-6 justify-between p-5 shadow-md">
                <button
                    onClick={scrollToPrevious}
                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none ${currentStep === 1 ? 'invisible' : ''}`}
                >
                    Previous
                </button>
                {currentStep > 1 && <StatusBar currentStep={currentStep} totalSteps={maxTiles} />}
                <button
                    onClick={scrollToNext}
                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none ${currentStep === maxTiles || (currentStep === 11 && images.length < 5) ? 'invisible' : ''}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Saving
                        </>
                    ) : (
                        <>
                            {currentStep === 1
                                ? 'Get Started'
                                : currentStep === secondStart - 1
                                    ? 'Initialize'
                                    : 'Next'}
                        </>
                    )}
                </button>
            </div>
        </main>
    );
};

export default NewListingForm;
