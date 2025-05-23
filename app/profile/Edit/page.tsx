'use client'

import { fetchUser, isBankDetailsAvailable, UpdateUserData } from '@/actions/users.actions';
// import DOMPurify from 'dompurify';
import toast from 'react-hot-toast'
import { useState, ChangeEvent, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { SlArrowRight } from 'react-icons/sl';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'; // Adjust the path to your config file
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from "@/firebase/firebaseConfig";
import 'react-datepicker/dist/react-datepicker.css';
import { useUserStore } from '@/store/store';
import DatePicker from 'react-datepicker';
import LanguageSelection from '@/components/shared/profile/LanguageSelection';
import dynamic from 'next/dynamic';
import DynamicHead from "@/components/DynamicHead";
import BankDetailsForm from '@/app/hostpanel/bankDetails/page';
import BankDetailsComponent from '@/components/profile/BankDetails';

export default function PersonalInfo() {
    const [loading, setLoading] = useState(true);

    const { setUser } = useUserStore();
    // const genderOptions = [
    //     { label: 'Male', value: 'male' },
    //     { label: 'Female', value: 'female' },
    //     { label: 'Other', value: 'other' },
    // ];
    const [user, setUserDetails] = useState<any>({
        first_name: "",
        last_name: "",
        profile_image: "",
        email_id: "",
        phone_number: "",
        dob: "",
        gender: "",
        description: "",
        language: [],
        address: "",
        city: "",
        area_name: "",
        state: "",
        zipCode: null,
    });

    const [updateduser, setUpdatedUser] = useState<any>({
        first_name: "",
        last_name: "",
        profile_image: "",
        email_id: "",
        phone_number: "",
        dob: "",
        gender: "",
        description: "",
        language: [],
        address: "",
        city: "",
        area_name: "",
        state: "",
        zipCode: null,
    });


    const getChangedData = (initial: any, current: any) => {
        const changedData: any = {};

        for (const key in current) {
            if (initial[key] !== current[key]) {
                changedData[key] = current[key];
            }
        }

        return changedData;
    };

    const handleSave = async () => {
        console.log(updateduser);

        const changedData = getChangedData(user, updateduser);
        console.log(changedData);

        if (Object.keys(changedData).length === 0) {
            toast('No changes detected.', { icon: '⚠️' });
            return;
        }
        const loadingToast = toast.loading("Saving Data...");

        try {
            const { success, error } = await UpdateUserData(
                changedData.first_name ?? null,
                changedData.last_name ?? null,
                changedData.email_id ?? null,
                changedData.phone_number ?? null,
                changedData.profile_image ?? null,
                changedData.dob ? new Date(changedData.dob) : null,
                changedData.gender ?? null,
                changedData.description ?? null,
                changedData.language ?? null,
                changedData.address ?? null,
                changedData.city ?? null,
                changedData.area_name ?? null,
                changedData.state ?? null,
                changedData.zipCode ?? null
            );
            toast.dismiss(loadingToast);
            if (success) {
                setUserDetails(updateduser);
                toast.success("User data updated successfully");
                setInput('')
            } else {
                toast.error(`Failed to update user data: ${error}`);
            }
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.error("An error occurred while updating user data.");
        }
    };


    const fetchDetails = async () => {
        try {
            const result: any = await fetchUser();
            console.log(result.data);

            if (result.success) {
                setUpdatedUser(result?.data);
                setUserDetails(result?.data);

                setprofileImageSrc(result?.data.profile_image);
                console.log(result.data)
            } else {
                toast.error("You are not allowed");
            }
        } catch (err) {
            toast.error("Server error: ");
            console.error(err);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchDetails();
    }, []);

    // const [editable, setEditable] = useState(false);
    const [profilemageSrc, setprofileImageSrc] = useState<string>(
        "https://www.looper.com/img/gallery/30-most-popular-boy-anime-characters-ranked-worst-to-best/intro-1648715126.jpg"
    );
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean | null>(false);
    const [crop, setCrop] = useState<Crop>({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
    });
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);


    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };;
    const [imageUpload, setImageUpload] = useState(false);
    const handleImageUpdate = async () => {
        if (croppedImageUrl) {
            setprofileImageSrc(croppedImageUrl);
            setImageUpload(true);

            try {
                // Create a blob from the cropped image
                const response = await fetch(croppedImageUrl);
                const blob = await response.blob();

                // Create a storage reference for the cropped image
                const userId = user?.user_id
                // console.log(user);
                // Use a unique filename
                const imageRef = ref(storage, `images/profilePicture/${userId}.jpg`);
                // Create an upload task
                const uploadTask = uploadBytesResumable(imageRef, blob);
                // Monitor the upload progress
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // Optional: Display upload progress if needed
                    },
                    (error) => {
                        console.error('Error uploading file:', error);
                        toast.error("Error uploading profile image");
                    },
                    async () => {
                        try {
                            // Get the download URL
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log('Cropped image uploaded successfully. Download URL:', downloadURL);

                            const updateResponse = await UpdateUserData(
                                null, null, null, null, downloadURL, null, null, null, null, null, null, null, null, null
                            );

                            if (updateResponse.success) {
                                setprofileImageSrc(downloadURL);
                                setUser({
                                    ...useUserStore.getState().user,
                                    profile_image: downloadURL,
                                });
                                toast.success("Profile image updated successfully");
                                setIsModalOpen(false);
                                setImageUpload(false);

                            } else {
                                setImageUpload(false);
                                console.error('Error updating user data:', updateResponse.error);
                                toast.error("Failed to update profile image");
                            }
                        } catch (error) {
                            setImageUpload(false);
                            console.error('Error getting download URL or updating user data:', error);
                            toast.error("Error updating profile image");
                        }
                    }
                );
            } catch (error) {
                console.error('Error processing cropped image:', error);
                toast.error("Error processing cropped image");
                setImageUpload(false);
            }

            // setImageUpload(false);
        }
    };

    const handleCropComplete = (crop: Crop) => {
        if (imageRef.current && crop.width && crop.height && previewCanvasRef.current) {
            const canvas = previewCanvasRef.current;
            const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
            const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
            const ctx = canvas.getContext("2d");

            canvas.width = crop.width;
            canvas.height = crop.height;

            if (ctx) {
                ctx.drawImage(
                    imageRef.current,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
            }

            canvas.toBlob((blob: any) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setCroppedImageUrl(url);
                }
            }, "image/jpeg");
        }
    };

    const [input, setInput] = useState('');

    const handleDateChange = (date: any) => {
        // setStartDate(date);
        setUpdatedUser({ ...updateduser, dob: date });
    };
    const [section, setSection] = useState(1);

    const [bankData, setBankData] = useState({
        accountType: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        pan: '',
        accountHolderName: '',
        gstNumber: ""
    });


    const [loading3, setLoading3] = useState(true);
    const fetchbankDetails = async () => {
        setLoading3(true);
        const response: any = await isBankDetailsAvailable();
        if (response.success) {
            console.log("Bank details found");
            console.log(response.data);

            setBankData({
                accountType: response.data.account_type,
                accountNumber: response.data.bank_account_number,
                confirmAccountNumber: response.data.bank_account_number,
                ifscCode: response.data.ifsc_code,
                pan: response.data.pan_number,
                accountHolderName: response.data.account_holder_name,
                gstNumber: response.data.gst_number,
            });
        }
        setLoading3(false);
    }
    useEffect(() => {
        fetchbankDetails();
    }, []);
    return (
        <div className="max-w-5xl mx-auto overflow-x-hidden display-no-scroll  h-[100vh] py-10 px-4 sm:px-6 lg:px-8">
            <DynamicHead title={"Personal Info"} />
            {
                loading ? <ProfilePageSkeleton /> :
                    <div className='md:h-[75vh]  '>
                        <div className="">
                            <div className="text-gray-500 flex items-center justify-start gap-2">
                                <a
                                    href="/profile"
                                    className="hover:text-pink-600 text-md md:text-lg font-semibold transition-colors"
                                >
                                    Account
                                </a>
                                <span>
                                    <SlArrowRight size={14} className="text-gray-400" />
                                </span>
                                <a
                                    href="#"
                                    className="hover:text-pink-600 text-md md:text-lg font-semibold transition-colors"
                                >
                                    Personal info
                                </a>
                            </div>
                            <div className="w-full flex justify-between items-center mt-3">
                                <h1 className="md:text-4xl text-xl font-bold">Personal info</h1>
                                {/* <p className="hover:text-pink-600 text-lg-500 mx-2 first-letter:font-semibold  transition-colors"> Edit Host Profile</p> */}
                            </div>
                            <p className="hidden font-semibold text-gray-500 md:block mb-5 mt-2">
                                Update your personal and contact details, including profile image, with ease and efficiency.
                            </p>
                            <div className="flex mx-5 items-start border-b-[1px] border-gray-300 space-x-4">
                                <div
                                    onClick={() => setSection(1)}
                                    className={`cursor-pointer px-4 py-2 text-center text-gray-600 ${section === 1
                                        ? "border-b-2 border-pink-500 text-pink-600 font-semibold"
                                        : "hover:text-pink-600  transition duration-300"
                                        }`}
                                >
                                    Basic Details
                                </div>

                                {
                                    user.isHost && (
                                        <>
                                            <div
                                                onClick={() => setSection(2)}
                                                className={`cursor-pointer px-4 py-2 text-center text-gray-600 ${section === 2
                                                    ? "border-b-2 border-pink-500 text-pink-600 font-semibold"
                                                    : "hover:text-pink-600 text-center transition duration-300"
                                                    }`}
                                            >
                                                Host Details
                                            </div>
                                            <div
                                                onClick={() => setSection(3)}
                                                className={`cursor-pointer px-4 py-2 text-center text-gray-600 ${section === 3
                                                    ? "border-b-2 border-pink-500 text-pink-600 font-semibold"
                                                    : "hover:text-pink-600 transition duration-300"
                                                    }`}
                                            >
                                                Bank Details
                                            </div>

                                        </>

                                    )
                                }

                            </div>
                        </div>
                        {
                            section == 1 &&
                            <div className="flex mx-3 flex-col-reverse mt-4 lg:flex-row ">
                                {/* Profile Details Section */}
                                <div className="px-3 mt-3 md:w-3/5">
                                    {/* Legal Name Section */}
                                    <div className="border-b py-4">
                                        <div className="flex flex-col justify-between items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div>
                                                    <div className="text-gray-600 text-sm">Legal Name</div>
                                                    {input === 'name' ? (
                                                        <div className="flex flex-col mt-4 w-full gap-1">
                                                            <div className="flex flex-row items-center justify-between gap-2">
                                                                <div>
                                                                    <label className="block text-gray-600 text-xs font-semibold uppercase mb-1">
                                                                        First Name
                                                                    </label>
                                                                    <input
                                                                        className="w-full p-2 border border-gray-300 rounded focus:border-pink-500"
                                                                        type="text"
                                                                        id="first_name"
                                                                        name="first_name"
                                                                        value={updateduser.first_name}
                                                                        onChange={(e) => setUpdatedUser({ ...updateduser, first_name: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-gray-600 text-xs font-semibold uppercase mb-1">
                                                                        Last Name
                                                                    </label>
                                                                    <input
                                                                        className="w-full p-2 border border-gray-300 rounded focus:border-pink-500"
                                                                        type="text"
                                                                        id="last_name"
                                                                        name="last_name"
                                                                        value={updateduser.last_name}
                                                                        onChange={(e) => setUpdatedUser({ ...updateduser, last_name: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="mt-5 h-[40px] w-[80px] rounded-lg bg-gradient-to-r red-gradient text-white font-bold cursor-pointer transition-colors duration-300"
                                                                onClick={() => { handleSave(); }}
                                                            >
                                                                Save
                                                            </button>

                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">{user.first_name + " " + user.last_name}</div>
                                                    )}


                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { input === 'name' ? setInput('') : setInput('name') }}
                                                        className="text-pink-600 font-medium  transition-colors duration-300"
                                                    >
                                                        {input === 'name' ? 'Close' : 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="border-b py-4">
                                        <div className="flex flex-col justify-between items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="w-[80%]">
                                                    <div className="text-gray-600 text-sm">Email Address</div>
                                                    {input === 'email' ? (
                                                        <div className="mt-4 w-full">
                                                            <input
                                                                className="w-full p-2 border border-gray-300 rounded focus:border-pink-500"
                                                                type="email"
                                                                id="email"
                                                                name="email"
                                                                value={updateduser.email_id}
                                                                onChange={(e) => setUpdatedUser({ ...updateduser, email_id: e.target.value })}
                                                            />
                                                            <button
                                                                className="mt-5 h-[40px] w-[80px] rounded-lg bg-gradient-to-r red-gradient text-white font-bold cursor-pointer transition-colors duration-300"
                                                                onClick={() => { handleSave(); }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">{user.email_id}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { input === 'email' ? setInput('') : setInput('email') }}
                                                        className="text-pink-600 font-medium  transition-colors duration-300"
                                                    >
                                                        {input === 'email' ? 'Close' : 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b py-4">
                                        <div className="flex flex-col justify-between items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="w-[80%]">
                                                    <div className="text-gray-600 text-sm">Date of Birth</div>
                                                    {input === 'DOB' ? (
                                                        <div className="mt-4 w-full">
                                                            <div className="mt-4">
                                                                <DatePicker
                                                                    selected={updateduser.dob}
                                                                    onChange={handleDateChange}
                                                                    placeholderText="Select Date"
                                                                    className="w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                                    dateFormat="PPP"
                                                                />
                                                            </div>
                                                            <button
                                                                className="mt-5 h-[40px] w-[80px] rounded-lg bg-gradient-to-r red-gradient text-white font-bold cursor-pointer transition-colors duration-300"
                                                                onClick={() => { handleSave(); }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">{user.dob ? new Date(user.dob).toLocaleDateString() : "Not Provided yet"}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { input === 'DOB' ? setInput('') : setInput('DOB') }}
                                                        className="text-pink-600 font-medium transition-colors duration-300"
                                                    >
                                                        {input === 'DOB' ? 'Close' : 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b py-4">
                                        <div className="flex flex-col justify-between items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="w-[80%]">
                                                    <div className="text-gray-600 text-sm">Phone Number</div>
                                                    {input === 'phone_number' ? (
                                                        <div className="mt-4 w-full">
                                                            <input
                                                                className="w-full p-2 border border-gray-300 rounded focus:border-pink-500"
                                                                type="number"
                                                                id="phone_number"
                                                                name="phone_number"
                                                                value={updateduser.phone_number}
                                                                onChange={(e) => setUpdatedUser({ ...updateduser, phone_number: e.target.value })}
                                                            />
                                                            <button
                                                                className="mt-5 h-[40px] w-[80px] rounded-lg bg-gradient-to-r red-gradient text-white font-bold cursor-pointer transition-colors duration-300"
                                                                onClick={() => { handleSave(); }}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">    {user.phone_number || "Not Provided yet"}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { input === 'phone_number' ? setInput('') : setInput('phone_number') }}
                                                        className="text-pink-600 font-medium  transition-colors duration-300"
                                                    >
                                                        {input === 'phone_number' ? 'Close' : 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b py-4">
                                        <div className="flex flex-col justify-between items-center">
                                            <div className="flex w-full justify-between items-center">
                                                <div className="w-4/5">
                                                    <div className="text-gray-600 text-sm">Gender</div>
                                                    {input === 'gender' ? (
                                                        <div className="mt-4 w-full">
                                                            <div className="flex items-center space-x-4">
                                                                <label className="inline-flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="gender"
                                                                        value="male"
                                                                        className="form-radio text-pink-500 h-4 w-4"
                                                                        checked={updateduser.gender === 'male'}
                                                                        onChange={(e) => setUpdatedUser({ ...updateduser, gender: e.target.value })}
                                                                    />
                                                                    <span className="ml-2 text-gray-700">Male</span>
                                                                </label>
                                                                <label className="inline-flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="gender"
                                                                        value="female"
                                                                        className="form-radio text-pink-500 h-4 w-4"
                                                                        checked={updateduser.gender === 'female'}
                                                                        onChange={(e) => setUpdatedUser({ ...updateduser, gender: e.target.value })}
                                                                    />
                                                                    <span className="ml-2 text-gray-700">Female</span>
                                                                </label>
                                                                <label className="inline-flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="gender"
                                                                        value="other"
                                                                        className="form-radio text-pink-500 h-4 w-4"
                                                                        checked={updateduser.gender === 'other'}
                                                                        onChange={(e) => setUpdatedUser({ ...updateduser, gender: e.target.value })}
                                                                    />
                                                                    <span className="ml-2 text-gray-700">Other</span>
                                                                </label>
                                                            </div>
                                                            <button
                                                                className="mt-5 h-8 px-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold cursor-pointer transition-colors duration-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500"
                                                                onClick={handleSave}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold text-lg">{user.gender || "Not Provided yet"}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => { input === 'gender' ? setInput('') : setInput('gender') }}
                                                        className="text-pink-600 font-medium transition-colors duration-300 hover:text-pink-800"
                                                    >
                                                        {input === 'gender' ? 'Close' : 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                                {/* Profile Image Section */}
                                <div className="md:w-2/5 mb-3 flex items-start lg:mt-0 lg:ml-10">
                                    <div className="w-full flex justify-center">
                                        <div className="w-24 h-24 mx-3 rounded-full md:w-56 md:h-56 bg-gray-600 md:rounded-2xl relative overflow-hidden">
                                            <Image
                                                src={profilemageSrc}
                                                width={80}
                                                height={80}
                                                className="rounded-2xl border-2 border-pink-600 object-contain w-full h-full"
                                                alt="profile image"
                                            />
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="absolute bottom-0 right-0  m-2 bg-[#0000007b] rounded-2xl p-2"
                                            >
                                                <Pencil color="white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        }


                        {section == 2 && (
                            <>
                                <div className="w-[95%] p-4 mx-auto bg-white rounded ">
                                    <div className=" pb-1">
                                        <div className="flex justify-between items-center">
                                            <div className="text-gray-600 text-lg font-semibold">Address</div>
                                            <button
                                                onClick={() => { input === 'address' ? setInput('') : setInput('address'); }}
                                                className="text-pink-500 font-medium hover:text-pink-700 transition-colors duration-300"
                                            >
                                                {input === 'address' ? 'Close' : 'Edit'}
                                            </button>
                                        </div>
                                    </div>
                                    {input === 'address' ? (
                                        <div className="mt-1  space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Address</label>
                                                    <input
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        value={updateduser.address}
                                                        onChange={(e) => setUpdatedUser({ ...updateduser, address: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-semibold mb-1">City</label>
                                                    <input
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        value={updateduser.city}
                                                        onChange={(e) => setUpdatedUser({ ...updateduser, city: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Area Name</label>
                                                    <input
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                                                        type="text"
                                                        id="area_name"
                                                        name="area_name"
                                                        value={updateduser.area_name}
                                                        onChange={(e) => setUpdatedUser({ ...updateduser, area_name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-semibold mb-1">State</label>
                                                    <input
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        value={updateduser.state}
                                                        onChange={(e) => setUpdatedUser({ ...updateduser, state: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-semibold mb-1">Zip Code</label>
                                                    <input
                                                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-pink-500"
                                                        type="Number"
                                                        id="zipCode"
                                                        name="zipCode"
                                                        value={updateduser.zipCode}
                                                        onChange={(e) => setUpdatedUser({ ...updateduser, zipCode: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    className="mt-5 px-6 py-2 rounded-md red-gradient text-white font-bold "
                                                    onClick={() => {
                                                        // handleSave(updateduser);
                                                        handleSave();
                                                        setInput('');
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-1 font-semibold text-gray-800">
                                            {user.address ? (
                                                <div>
                                                    <p>{user.address}</p>
                                                    <p>{`${user.city}, ${user.area_name}, ${user.state}, ${user.zipCode}`}</p>
                                                </div>
                                            ) : (
                                                'No Address Provided'
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="w-[95%] p-4 mx-auto bg-white rounded ">
                                    <LanguageSelection
                                        user={user}
                                        updateduser={updateduser}
                                        setUpdatedUser={setUpdatedUser}
                                        input={input}
                                        setInput={setInput}
                                        handleSave={handleSave}
                                    />
                                </div>
                                <div className="w-[95%] p-4 mx-auto bg-white rounded ">
                                    <DescriptionTaker
                                        user={user}
                                        updateduser={updateduser}
                                        setUpdatedUser={setUpdatedUser}
                                        input={input}
                                        setInput={setInput}
                                        handleSave={handleSave}
                                    />
                                </div>

                            </>
                        )}
                        {section == 3 && (
                            <>
                                <BankDetailsComponent
                                    bankData={bankData}
                                    setBankData={setBankData}
                                    loading={loading3}
                                />

                            </>
                        )}

                        {
                            isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                                    <div className="relative bg-white p-8 h-[350px] w-[350px]  rounded-lg shadow-lg max-w-lg  flex flex-col items-center justify-center">
                                        <button
                                            onClick={() => { setIsModalOpen(false); setImageSrc('') }}
                                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                        >
                                            <AiOutlineClose size={24} />
                                        </button>
                                        <div className="flex flex-col mt-[15px] items-center">
                                            {imageSrc ? (
                                                <div className="max-h-60 max-w-60 overflow-hidden mb-4">
                                                    <ReactCrop
                                                        crop={crop}
                                                        onChange={(newCrop) => setCrop(newCrop)}
                                                        onComplete={handleCropComplete}
                                                    >
                                                        <img ref={imageRef} src={imageSrc} alt="Crop me" className="w-full h-full object-cover" />
                                                    </ReactCrop>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dotted border-gray-300 rounded-md cursor-pointer relative mb-4">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageUpload}
                                                            className="absolute w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <AiOutlinePlus size={30} className="text-gray-500" />
                                                    </div>
                                                </>
                                            )}
                                            <canvas ref={previewCanvasRef} style={{ display: "none" }}></canvas>
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <button
                                                onClick={handleImageUpdate}
                                                className={`bg-pink-500 text-white px-4 py-2 rounded transition-colors duration-300 ${imageUpload ? 'cursor-not-allowed' : 'hover:bg-pink-600'
                                                    }`}
                                                disabled={imageUpload} // Disable button while uploading
                                            >
                                                {imageUpload ? (
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 20a8 8 0 100-16v4a4 4 0 110 8z"
                                                            />
                                                        </svg>
                                                        Saving...
                                                    </div>
                                                ) : (
                                                    'Update Profile Image'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
            }

        </div>
    );
}

const ProfilePageSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Breadcrumb and Heading */}
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-gray-300 h-4 w-24 rounded"></div>
                <span>
                    <div className="bg-gray-300 h-4 w-4 rounded-full"></div>
                </span>
                <div className="bg-gray-300 h-4 w-32 rounded"></div>
            </div>
            <h1 className="text-2xl font-bold mb-6">
                <div className="bg-gray-300 h-6 w-48 rounded"></div>
            </h1>

            <div className="flex flex-col-reverse md:flex-row">
                {/* Profile Details Section */}
                <div className="flex-1 md:pr-6">
                    {/* Legal Name Section */}
                    <div className="border-b border-gray-200 py-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-300 h-5 w-32 rounded"></div>
                            <div className="bg-gray-300 h-5 w-16 rounded"></div>
                        </div>
                        <div className="mt-4">
                            <div className="bg-gray-300 h-8 w-full rounded mb-2"></div>
                            <div className="bg-gray-300 h-8 w-3/4 rounded"></div>
                        </div>
                    </div>

                    {/* Email Address Section */}
                    <div className="border-b border-gray-200 py-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="bg-gray-300 h-5 w-32 rounded"></div>
                            <div className="bg-gray-300 h-5 w-16 rounded"></div>
                        </div>
                        <div className="mt-4">
                            <div className="bg-gray-300 h-8 w-full rounded mb-2"></div>
                        </div>
                    </div>

                </div>

                {/* Profile Image Section */}
                <div className="md:w-1/3 flex items-center justify-center mt-4 md:mt-0">
                    <div className="bg-gray-300 h-24 w-24 md:h-48 md:w-48 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

const DescriptionTaker = ({ user, updateduser, setUpdatedUser, input, setInput, handleSave }: any) => {
    const RichTextEditor = useMemo(() => dynamic(
        () => import('@/components/shared/Description'),
        {
            loading: () => <p>The Editor is loading</p>,
            ssr: false
        }
    ), [])
    const handleDescriptionChange = (value: any) => {
        setUpdatedUser({ ...updateduser, description: value });
    };


    return (
        <div className="w-full bg-white rounded ">
            <div className="flex flex-col justify-between items-center">
                <div className="flex  flex-col w-full justify-between items-center">
                    <div className="w-full flex justify-between items-center">
                        <div className="text-gray-600 text-lg font-semibold">Tell us about yourself</div>
                        <button
                            onClick={() => {
                                input === 'description' ? setInput('') : setInput('description');
                            }}
                            className="text-pink-600 font-medium transition-colors duration-300"
                        >
                            {input === 'description' ? 'Close' : 'Edit'}
                        </button>


                    </div>
                    <div className='w-full' >
                        {input === 'description' ? (
                            <div className="flex flex-col space-y-4">

                                <RichTextEditor
                                    value={updateduser.description}
                                    onChange={handleDescriptionChange}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold hover:from-pink-600 hover:to-red-600 transition-colors duration-300"
                                        onClick={() => {
                                            // Save the selected languages to the user's profile
                                            handleSave();
                                            setInput('');
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                        ) : (
                            <div className="font-semibold  text-left w-full text-lg">
                                <div
                                    className=" max-w-none w-full text-left mb-10 leading-relaxed text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: user.description || '' }}
                                />
                                {/* {user.description || 'No Description Provided'} */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


