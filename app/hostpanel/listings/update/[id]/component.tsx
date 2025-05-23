import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AiFillCheckCircle, AiOutlineMinus, AiOutlinePicture, AiOutlinePlus } from 'react-icons/ai';
import { FaHome, FaDoorOpen, FaUsers, FaPlus } from 'react-icons/fa';
import { GiCookingPot, GiArena, GiSoccerKick } from 'react-icons/gi';
import { PiSwimmingPoolLight } from 'react-icons/pi';
import { HiWifi } from 'react-icons/hi';
import { FaParking } from 'react-icons/fa'
import { RxCross2 } from "react-icons/rx";
import { TbAirConditioning } from "react-icons/tb";
import { BsLightningCharge } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Switch } from "@/components/ui/switch";
import { ChangeCoverPic, deleteImage, getAllAmmenities, getAllCategories, setCoverPic } from "@/actions/listing/listing.action";
import toast from "react-hot-toast";
import { FaRupeeSign } from 'react-icons/fa';





export const TypeOfVilla = ({ formData, setFormData }: any) => {


    const handleSelect = (type: any) => {
        // setSelectedType(type);
        setFormData((prev: any) => ({
            ...prev, villaType: type
        }))
    };

    const isSelected = (type: any) => formData.villaType === type;
    return (
        <div className="w-full h-[75vh] flex flex-col items-center justify-center p-4 ">
            <p className="text-2xl font-semibold mb-6">What type of place will guests have?</p>

            <div className="w-full max-w-md flex flex-col space-y-4">
                <div
                    onClick={() => handleSelect('entirePlace')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('entirePlace') ? 'border-pink-500' : 'border-gray-300'}`}
                >
                    <div className="flex items-center space-x-4">
                        <FaHome className={isSelected('entirePlace') ? "text-pink-500" : "text-gray-700"} size={24} />
                        <div>
                            <label className="text-lg font-medium text-gray-800">An Entire Place</label>
                            <p className="text-sm text-gray-600">
                                Guests have the whole place to themselves.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => handleSelect('room')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('room') ? 'border-pink-500' : 'border-gray-300'}`}
                >
                    <div className="flex items-center space-x-4">
                        <FaDoorOpen className={isSelected('room') ? "text-pink-500" : "text-gray-700"} size={24} />
                        <div>
                            <label className="text-lg font-medium text-gray-800">A Room</label>
                            <p className="text-sm text-gray-600">
                                Guests have their own room in the home plus access to shared spaces.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => handleSelect('sharedRoom')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('sharedRoom') ? 'border-pink-500' : 'border-gray-300'}`}
                >
                    <div className="flex items-center space-x-4">
                        <FaUsers className={isSelected('sharedRoom') ? "text-pink-500" : "text-gray-700"} size={24} />
                        <div>
                            <label className="text-lg font-medium text-gray-800">A Shared Room</label>
                            <p className="text-sm text-gray-600">
                                Guests sleep in a common area that may be shared with others.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export const MapLocation = ({ formData, setFormData }: any) => {
    const DynamicMap = useMemo(() => dynamic(
        () => import('@/components/Map'),
        {
            loading: () => <p>A map is loading...</p>,
            ssr: false
        }
    ), []);

    const [url, setUrl] = useState('');
    const [zoom, setZoom] = useState(10);

    useEffect(() => {
        if (navigator.geolocation && formData.coordinate.length === 0) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData((prevState: any) => ({
                        ...prevState,
                        coordinate: [latitude, longitude]
                    }));
                    setZoom(4);
                    console.log("Zoon Updated in use effect 1", zoom)
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        }
    }, [formData.coordinate]);

    useEffect(() => {
        if (formData.coordinate.length === 2) {
            setZoom(4); // Adjust zoom level dynamically when coordinates are updated
        }
    }, [formData.coordinate]);


    function extractCoordinates(url: string) {
        try {
            const regex = /@([-+]?\d*\.\d+),([-+]?\d*\.\d+)/;
            const match = url.match(regex);

            if (match && match.length >= 3) {
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);

                setFormData((prevState: any) => ({
                    ...prevState,
                    coordinate: [lat, lng]
                }));

                setZoom(4); // Automatically zoom into the extracted coordinates
            }
        } catch (error) {
        }
    }


    const handleUrlChange = (e: any) => {
        setUrl(e.target.value);
    };

    const handleFetchCoordinates = () => {
        extractCoordinates(url);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="w-full no-scrollbar mx-auto h-full flex flex-col items-left overflow-scroll justify-center p-6  rounded-lg  bg-white ">
            <h1 className="mb-6 text-3xl font-bold text-left">
                Address
            </h1>
            <p className="text-gray-600 mb-6">
                Set your villa's location on the map!
            </p>
            <input
                type="text"
                value={url}
                onChange={handleUrlChange}
                placeholder="Enter Google Maps URL"
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <button
                onClick={handleFetchCoordinates}
                className="px-4 py-2 red-gradient text-white rounded-md"
            >
                Fetch Coordinates
            </button>
            <p className="mt-2 text-sm text-gray-500">Or manually select a location on the map.</p>
            <div className="w-full h-[400px] max-w-4xl rounded-lg overflow-hidden mb-4 mt-4 z-10">
                <DynamicMap
                    key={`${formData.coordinate?.join(',')}-${zoom}`} // Force re-render when zoom or coordinates change
                    zoom={zoom}
                    position={formData.coordinate}
                    formData={formData}
                    setFormData={setFormData}
                />


            </div>

            <div className="space-y-6">
                <label className="block">
                    <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">Address</span>
                    <input
                        className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <label className="block">
                    <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">Area Name</span>
                    <input
                        className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        type="text"
                        id="area_name"
                        name="area_name"
                        value={formData.area_name}
                        onChange={handleChange}
                    />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className="block">
                        <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">Zip code</span>
                        <input
                            className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            type="number"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="block">
                        <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">City</span>
                        <input
                            className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="block">
                        <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">State</span>
                        <input
                            className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};




export const Address = ({ formData, setFormData }: any) => {

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    };

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left  justify-center p-4">
            <h1 className="mb-4 text-2xl font-bold">Detailed Address</h1>
            <p className="text-gray-600 mb-4">
                Set your villa's location on the map!.</p>

            <div className="form space-y-4">

                <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                    <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Address</span>
                    <input
                        className="field__input bg-transparent text-lg font-bold focus:outline-none"
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                    <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Area Name</span>
                    <input
                        className="field__input bg-transparent text-lg font-bold focus:outline-none"
                        type="text"
                        id="area_name"
                        name="area_name"
                        value={formData.area_name}
                        onChange={handleChange}
                    />

                </label>
                <div className="fields grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                        <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Zip code</span>
                        <input
                            className="field__input bg-transparent text-lg font-bold focus:outline-none"
                            type="number"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                        <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">City</span>
                        <input
                            className="field__input bg-transparent text-lg font-bold focus:outline-none"
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                        <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">State</span>
                        <input
                            className="field__input bg-transparent text-lg font-bold focus:outline-none"
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />

                    </label>
                </div>
            </div>

        </div>
    );
};



export const VillaDetails = ({ formData, setFormData }: any) => {
    console.log("villa details are : ", formData);


    const handleIncrement = (field: any) => {
        setFormData((prevState: any) => ({
            ...prevState,
            [field]: prevState[field] + 1
        }));
    };

    const handleDecrement = (field: any) => {
        if (formData[field] > 0) {
            setFormData((prevState: any) => ({
                ...prevState,
                [field]: prevState[field] - 1
            }));
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: parseInt(value) // Ensure to parse the value as an integer
        }));
    };



    return (
        <div className="w-full mx-auto h-full flex flex-col items-left justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Basic Details</h1>
            <p className="text-gray-600 mb-4  pb-3">
                You'll add more details later, such as bed types.
            </p>

            <p className="font-semibold text-[17px] mt-3">Room Details</p>
            <div className="flex items-center border rounded-md mt-3 p-4 justify-between mb-3">
                <div className="space-y-0.5">
                    <label className="text-base">Number of Bedrooms</label>
                    <p className="text-gray-500 text-sm">
                        Specify how many bedrooms your villa has.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBedrooms')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="numberOfBedrooms"
                        value={formData.numberOfBedrooms}
                        onChange={handleChange}
                        className="w-12 px-1 py-1 border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBedrooms')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>

            <div className="flex items-center border rounded-md p-4 justify-between mb-3">
                <div className="space-y-0.5">
                    <label className="text-base">Number of Bathrooms</label>
                    <p className="text-gray-500 text-sm">
                        Indicate the total number of bathrooms available.
                    </p>
                </div>


                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBathrooms')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="numberOfBathrooms"
                        value={formData.numberOfBathrooms}
                        onChange={handleChange}
                        className="w-12 px-3 py-1 border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBathrooms')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>

            <div className="flex items-center border rounded-md p-4 justify-between mb-6">
                <div className="space-y-0.5">
                    <label className="text-base">Number of Beds</label>
                    <p className="text-gray-500 text-sm">
                        Provide the total number of beds in your villa.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBeds')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="numberOfBeds"
                        value={formData.numberOfBeds}
                        onChange={handleChange}
                        className="w-12 px-3 py-1 border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBeds')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>


            <p className="font-semibold text-[17px] mt-3">Guest Details</p>
            <div className="flex items-center border rounded-md mt-3 p-4 justify-between mb-3">
                <div className="space-y-0.5">
                    <label className="text-base">Maximum ocuupancy </label>
                    <p className="text-gray-500 text-sm">
                        Indicate the maximum number of guests allowed.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('maxGuests')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="maxGuests"
                        value={formData.maxGuests}
                        onChange={handleChange}
                        className="w-12 px-1 py-1 border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('maxGuests')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>

            <div className="flex items-center border rounded-md p-4 justify-between mb-3">
                <div className="space-y-0.5">
                    <label className="text-base">Minimum ocuupancy</label>
                    <p className="text-gray-500 text-sm">
                        Specify how many bedrooms your villa has.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('minGuests')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="minGuests"
                        value={formData.minGuests}
                        onChange={handleChange}
                        className="w-12 px-3 py-1 border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('minGuests')}
                        className="px-2 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>



            <p className="font-semibold text-[17px] mt-6">Other Details</p>
            <div className="flex w-full flex-row mt-3 items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label className="text-base">Family Only</label>
                    <p className="text-gray-500 text-sm">
                        Only family will be able to book this property
                    </p>
                </div>
                <div>
                    <Switch
                        checked={formData.family_only}
                        onCheckedChange={(checked: any) => {
                            setFormData((prevData: any) => {

                                return { ...prevData, family_only: !formData.family_only };
                            });
                            console.log(formData);
                        }
                        }
                        aria-readonly
                    />
                </div>
            </div>
            {/* <div className="flex flex-row mt-2 items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label className="text-base">Bnb Verified</label>
                    <p className="text-gray-500 text-sm">
                        This means bnbIndia have verified your propert
                    </p>
                </div>
                <div>
                    <Switch
                        checked={formData.bnbVerified}
                        onCheckedChange={(checked: any) => {
                            setFormData((prevData: any) => {

                                return { ...prevData, bnbVerified: !formData.bnbVerified };
                            });
                            // console.log(formData);
                        }
                        }
                        aria-readonly
                    />
                </div>
            </div> */}

            <div className="flex flex-row mt-2 items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label className="text-base">Listed</label>
                    <p className="text-gray-500 text-sm">
                        Publish this property to customers.
                    </p>
                </div>
                <div>
                    <Switch
                        checked={formData.isListed}
                        onCheckedChange={(checked: any) => {
                            setFormData((prevData: any) => {

                                return { ...prevData, isListed: !formData.isListed };
                            });
                            // console.log(formData);
                        }
                        }
                        aria-readonly
                    />
                </div>
            </div>

        </div>

    );
};



export const Ammenity = ({ formData, setFormData }: any) => {
    const [amenities, setAmenities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loader state

    // Fetch amenities on component mount
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                setLoading(true);
                const data = await getAllAmmenities();
                setAmenities(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch amenities:", error);
            }
        };

        fetchAmenities();
    }, []);

    const [showUnavailable, setShowUnavailable] = useState(false);

    const toggleAmenity = (id: string) => {

        if (
            showUnavailable
        ) {
            if (formData.amenity_name.includes(id)) {
                setFormData((prevData: any) => ({
                    ...prevData,
                    amenity_name: prevData.amenity_name.filter((item: string) => item !== id),
                }));
            } else {
                setFormData((prevData: any) => ({
                    ...prevData,
                    amenity_name: [...prevData.amenity_name, id],
                }));
            }
        }

    };

    const isAmenitySelected = (id: string) => formData.amenity_name.includes(id);

    const availableAmenities = amenities.filter((amenity: any) => isAmenitySelected(amenity.amenity_name));
    const unavailableAmenities = amenities.filter((amenity: any) => !isAmenitySelected(amenity.amenity_name));

    return (
        <div className="w-full p-6  h-[75vh]  flex flex-col   border-gray-300">

            <div className="flex items-center justify-between">
                <h1 className="mb-4 text-3xl font-bold text-left">Amenity</h1>
                <div
                    className="relative flex items-center justify-around space-x-2 h-[30px] w-[70px] text-gray-500 p-2 rounded-full bg-gray-100 hover:border-pink-500 hover:text-pink-500 hover:bg-white border-[1px] cursor-pointer"
                    onClick={() => setShowUnavailable(!showUnavailable)}
                >
                    {/* <AiOutlinePlus size={20} className="hover:text-pink-500" />
                     */}
                    Edit
                </div>
            </div>
            <p className="text-gray-600 mb-4 pb-3">
                You can add more amenities after you publish your listing.
            </p>
            <div className="flex flex-wrap gap-3">
                {
                    loading ?
                        (
                            <div className="py-2 flex flex-wrap gap-2">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-24 h-10 bg-gray-300 animate-pulse rounded-lg"
                                    />
                                ))}
                            </div>
                        )
                        :
                        availableAmenities.map((amenity: any) => (
                            <div
                                key={amenity.amenity_id}
                                onClick={() => toggleAmenity(amenity.amenity_name)}
                                className={`flex items-center text-[1rem] rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                            ${isAmenitySelected(amenity.amenity_name)
                                        ? 'border-pink-500 border shadow-md'
                                        : 'border shadow-sm'
                                    }`}
                            >
                                <button
                                    type="button"
                                    className="p-1 bg-transparent focus:outline-none object-contain"
                                >

                                    <Image
                                        src={amenity.amenity_image}
                                        alt={amenity.label || "Amenity"}
                                        width={32} // Set the width for the image
                                        height={32} // Set the height for the image
                                        className={`object-contain ${isAmenitySelected(amenity.amenity_name) ? 'border-pink-500' : 'border-gray-300'}`}
                                    />
                                </button>
                                <span className={`${isAmenitySelected(amenity.amenity_name) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                    {amenity.amenity_name}
                                </span>
                            </div>
                        ))}
            </div>

            {showUnavailable && (
                <>
                    <hr className="my-4 border-gray-300" />
                    <h2 className="text-xl font-semibold mb-4">Unavailable Amenities</h2>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {unavailableAmenities.map((amenity: any) => (
                            <div
                                key={amenity.amenity_id}
                                onClick={() => toggleAmenity(amenity.amenity_name)}
                                className={`flex items-center text-[1rem] rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                        ${isAmenitySelected(amenity.amenity_name)
                                        ? 'border-pink-500 border shadow-md'
                                        : 'border shadow-sm'
                                    }`}
                            >
                                <button
                                    type="button"
                                    className="p-1 bg-transparent focus:outline-none"
                                >

                                    <Image
                                        src={amenity.amenity_image}
                                        alt={amenity.label || "Amenity"}
                                        width={32} // Set the width for the image
                                        height={32} // Set the height for the image
                                        className={`object-contain ${isAmenitySelected(amenity.amenity_name) ? 'text-pink-500' : 'text-gray-700'}`}
                                    />
                                </button>
                                <span className={`text-lg ${isAmenitySelected(amenity.amenity_name) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                    {amenity.amenity_name}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};


export const PropertyCategory = ({ formData, setFormData }: any) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loader state
    const [searchTerm, setSearchTerm] = useState(''); // Search term state
    const [showUnavailable, setShowUnavailable] = useState(false); // Edit mode state

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllCategories();
                console.log({ data });
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const toggleCategory = (id: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            category_code: prevData.category_code ?
                (prevData.category_code.includes(id)
                    ? prevData.category_code.filter((item: string) => item !== id)
                    : [...prevData.category_code, id]
                )
                : [id]  // Initialize if undefined
        }));
    };

    const isCategorySelected = (id: string) =>
        Array.isArray(formData.category_code) && formData.category_code.includes(id);

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.category_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate selected and unselected categories
    const selectedCategories = categories.filter(category => isCategorySelected(category.category_code));
    const unselectedCategories = categories.filter(category => !isCategorySelected(category.category_code));

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left justify-center p-4 border-gray-300">
            <div className="flex flex-col">
                <div className="flex w-full items-center justify-between">
                    <h1 className="mb-4 text-2xl font-bold">Categories</h1>
                    {/* Edit Button */}
                    <div
                        className="relative flex items-center justify-around space-x-2 h-[30px] w-[70px] text-gray-500 p-2 rounded-full bg-gray-100 hover:border-pink-500 hover:text-pink-500 hover:bg-white border-[1px] cursor-pointer"
                        onClick={() => setShowUnavailable(!showUnavailable)}
                    >
                        Edit
                    </div>
                </div>
                <p className="text-gray-600 mb-4 pb-3">
                    You can add more categories after you publish your listing.
                </p>
            </div>

            {/* Search Bar (Visible in Edit Mode) */}
            {showUnavailable && (
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                />
            )}

            {/* Display Selected Categories */}
            <div className="flex flex-wrap gap-4">
                {loading ? (
                    <div className="py-2 flex flex-wrap gap-2">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="w-24 h-10 bg-gray-300 animate-pulse rounded-lg"
                            />
                        ))}
                    </div>
                ) : (
                    selectedCategories.map((category: any) => (
                        <div
                            key={category.category_id}
                            onClick={() => toggleCategory(category.category_code)}
           
                            className={`flex items-center text-[1rem] rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                                ${isCategorySelected(category.category_code)
                                    ? 'border-pink-500 border shadow-md'
                                    : 'border shadow-sm'
                                }`}
                        >
                            <button
                                type="button"
                                className="p-2 rounded-lg bg-transparent focus:outline-none"
                            >
                                <Image
                                    src={category.category_image}
                                    alt={category.label || "Category"}
                                    width={32} // Set the width for the image
                                    height={32} // Set the height for the image
                                    className={`rounded-full ${isCategorySelected(category.category_code) ? 'border-pink-500' : 'border-gray-300'}`}
                                />
                            </button>
                            <span className={`text-lg ${isCategorySelected(category.category_code) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                {category.category_name}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Display Unselected Categories in Edit Mode */}
            {showUnavailable && (
                <>
                    <hr className="my-4 border-gray-300" />
                    <h2 className="text-xl font-semibold mb-4">Unselected Categories</h2>
                    <div className="flex flex-wrap gap-4">
                        {filteredCategories
                            .filter(category => !isCategorySelected(category.category_code))
                            .map((category: any) => (
                                <div
                                    key={category.category_id}
                                    onClick={() => toggleCategory(category.category_code)}
                                    className={`flex items-center text-[1rem] rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                                        ${isCategorySelected(category.category_code)
                                            ? 'border-pink-500 border shadow-md'
                                            : 'border shadow-sm'
                                        }`}
                                >
                                    <button
                                        type="button"
                                        className="p-2 rounded-lg bg-transparent focus:outline-none"
                                    >
                                        <Image
                                            src={category.category_image}
                                            alt={category.label || "Category"}
                                            width={32} // Set the width for the image
                                            height={32} // Set the height for the image
                                            className={`rounded-full ${isCategorySelected(category.category_code) ? 'border-pink-500' : 'border-gray-300'}`}
                                        />
                                    </button>
                                    <span className={`text-lg ${isCategorySelected(category.category_code) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                        {category.category_name}
                                    </span>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};


export const TitlePage = ({ formData, setFormData }: any) => {

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    };


    return (
        <div className="w-full mx-auto h-full items-left mt-[50px] justify-center flex flex-col  p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Tell guests what your place is called</h1>
            <p className="text-gray-600 mb-4 pb-3">
                Short titles work best. Have fun with it - YOU can always change it later.
            </p>


            <label className="block">
                <span className="block text-gray-600 text-xs font-semibold uppercase mb-2">Title</span>
                <input
                    className="block w-full bg-gray-50 text-lg font-bold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};
export const DescriptionPage = ({ VillaDescription, setVillaDescription }: any) => {
    const RichTextEditor = useMemo(() => dynamic(
        () => import('@/components/shared/Description'),
        {
            loading: () => <p>The Editor is loading</p>,
            ssr: false
        }
    ), [])
    const onChange = (e: any) => {
        setVillaDescription((prev: any) => ({
            ...prev,
            description: e,
        }));
    };


    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Create your description
            </h1>
            <p className="text-gray-600 mb-4 pb-3">
                Share what makes your place special.
            </p>
            <RichTextEditor
                value={VillaDescription}
                onChange={onChange}
            />
        </div>
    );
};

export const UploadImage = ({ images, setImages, handleImageChange, isUploading, setUploading, profilePic, setProfilePic }: any) => {

    console.log(images, profilePic)
    const removeImage = async (img: any) => {
        const id = img?.villaImage_uid
        // console.log(img.image_url,profilePic)
        if (img.image_url === profilePic) {
            toast.error("Cover Image cannot be removed !!")
            return;
        }
        if (images.length > 5) {
            // console.log("profile pic is ", profilePic)
            setUploading(true);
            const d: any = await deleteImage(id);
            setImages(images.filter((images: any) => images.villaImage_uid !== id))
            setUploading(false);
        }
        else {
            toast.error("At least 5 images are required!");
        }
    };
    const handleCoverChange = async (img: any) => {
        console.log(img);
        setUploading(true);
        const r: any = await setCoverPic(img.villa_id, img.image_url)
        if (r.success) {
            setProfilePic(img.image_url)
        }
        else {
            toast.error("Error changing cover")
        }
        console.log(r);
        setUploading(false);
    };

    return (
        <div className="w-full mx-auto mt-5 min-h-[65vh] flex flex-col items-left justify-center p-4 pb-[20vh] border-gray-300">

            <div className="flex items-center justify-between">

                <h1 className="mb-4 text-3xl font-bold text-left">Photo Tour</h1>
                <div className="relative flex items-center justify-around space-x-2 h-[30px] w-[70px] text-gray-500 p-2 rounded-full bg-gray-100 hover:border-pink-500 hover:text-pink-500 hover:bg-white border-[1px] cursor-pointer">
                    <AiOutlinePlus size={20} className=" hover:text-pink-500" />
                    <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
            </div>
            <p className="text-gray-400 mt-4 font-semibold  md:mb-4 text-left">
                You'll need <span className="font-bold">5 photos</span> to get started. You can add more or make changes later.
            </p>
            {isUploading && (
                <div className="flex w-full items-center justify-center mb-4">
                    <div className="flex w-full items-center space-x-2">
                        <div className="loader w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        <span className="text-gray-600 w-full font-semibold">Making changes...</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col w-full ">

                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start   no-scrollbar">

                        {images?.length > 0 &&
                            images.map((image: any, index: number) => (
                                <div
                                    key={image.villaImage_uid || index} // Use unique key
                                    className="flex flex-col items-center shadow-lg rounded-md overflow-hidden border relative w-full  md:w-40 md:h-40"
                                >
                                    {image.image_url ? ( // Check if `image_url` exists
                                        <Image
                                            onClick={() => handleCoverChange(image)}
                                            src={image.image_url}
                                            alt={`img-${index}`}
                                            width={600}
                                            height={600}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeImage(image)}
                                        className="absolute top-2 right-2 bg-black text-white rounded-full p-1 hover:bg-gray-800 shadow-md"
                                    >
                                        <RxCross2 />
                                    </button>
                                    {profilePic === image.image_url && (
                                        <button className="absolute top-2 left-2 bg-black text-white rounded-sm font-semibold p-1 px-2 shadow-md">
                                            Cover
                                        </button>
                                    )}
                                </div>
                            ))}

                    </div>

                </div>

            </div>
        </div>
    );
};


export const TypeOfReservations = ({ formData, setFormData }: any) => {

    const handleSelect = (type: any) => {
        setFormData((prev: any) => ({
            ...prev,
            bookingType: type
        }));
        // console.log(formData);

    };

    const isSelected = (type: any) => formData.bookingType === type ? 'border-pink-500' : 'border-gray-300';
    const iconColor = (type: any) => formData.bookingType === type ? 'text-pink-500' : 'text-gray-700';

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center justify-center p-4">
            <h1 className="mb-4 text-2xl font-bold">Decide how you'll confirm reservations</h1>
            <div className="w-full md:w-[500px] flex justify-between flex-col space-y-4">
                <div
                    onClick={() => handleSelect('INSTANT')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('INSTANT')}`}
                >
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Use Instant Book</label>
                            <p className="text-sm text-gray-600">Guests can book automatically.</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${iconColor('INSTANT')}`} size={24} />
                </div>

                <div
                    onClick={() => handleSelect('REQUEST')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('REQUEST')}`}
                >
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Approve or decline requests</label>
                            <p className="text-sm text-gray-600">Guests must ask if they can book.</p>
                        </div>
                    </div>
                    <IoChatbubbleEllipsesOutline className={`${iconColor('REQUEST')}`} size={24} />
                </div>
            </div>
        </div>
    );
};



export const PricePerGuest = ({ formData, setFormData }: any) => {
    const [price, setPrice] = useState(formData.pricePerGuest || '');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Remove non-digit characters before formatting
        const cleanedValue = value.replace(/\D/g, '');
        // Convert to integer for storing in form data
        const intValue = parseInt(cleanedValue, 10);
        // Format with commas for display
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setPrice(formattedValue);
        setFormData((prevState: any) => ({
            ...prevState,
            pricePerGuest: intValue
        }));
    };
    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center justify-center md:w-[30vw] p-4 border-gray-300">
            <h1 className="mb-4 text-2xl md:text-3xl font-bold text-center">
                Now, set your Price (per Guest)
            </h1>
            <p className="text-gray-600 mb-4 text-center">
                You can change it anytime
            </p>
            <div className="flex items-center justify-center w-full">
                <FaRupeeSign className="text-gray-600 text-3xl md:text-4xl mr-2" />
                <input
                    className="bg-transparent text-center text-3xl md:text-5xl font-extrabold focus:outline-none w-full max-w-[200px] md:max-w-[300px]"
                    type="text"
                    id="pricePerGuest"
                    name="pricePerGuest"
                    value={price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    inputMode="numeric"
                />
            </div>
        </div>
    );
};


export const PricePerDay = ({ formData, setFormData }: any) => {
    const [price, setPrice] = useState(formData.pricePerDay || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Remove non-digit characters before formatting
        const cleanedValue = value.replace(/\D/g, '');
        // Convert to integer for storing in form data
        const intValue = parseInt(cleanedValue, 10);
        // Format with commas for display
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setPrice(formattedValue);
        setFormData((prevState: any) => ({
            ...prevState,
            pricePerDay: intValue
        }));
    };
    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center justify-center md:w-[30vw] p-4 border-gray-300">
            <h1 className="mb-4 text-2xl md:text-3xl font-bold text-center">
                Now, set your Price (per Day)
            </h1>
            <p className="text-gray-600 mb-4 text-center">
                You can change it anytime
            </p>
            <div className="flex items-center justify-center w-full">
                <FaRupeeSign className="text-gray-600 text-3xl md:text-4xl mr-2" />
                <input
                    className="bg-transparent text-center text-3xl md:text-5xl font-extrabold focus:outline-none w-full max-w-[200px] md:max-w-[300px]"
                    type="text"
                    id="pricePerDay"
                    name="pricePerDay"
                    value={price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    inputMode="numeric"
                />
            </div>
        </div>
    );
};


export const OtherDetails = ({ formData, setFormData }: any) => {

    return (
        <div className="w-full  mx-auto h-[75vh] flex flex-col items-center justify-center md:w-[50vw] p-4 border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">
                Other Details
            </h1>
            <p className="text-gray-600 mb-4 pb-3">
                You can change it anytime
            </p>
            <div className="mx-auto  bg-white rounded-lg" >
                <div className="flex w-full flex-row mt-5 items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <label className="text-base">Family Only</label>
                        <p>
                            Only family will be able to book this property
                        </p>
                    </div>
                    <div>
                        <Switch
                            checked={formData.family_only}
                            onCheckedChange={(checked: any) => {
                                setFormData((prevData: any) => {

                                    return { ...prevData, family_only: !formData.family_only };
                                });
                                // console.log(formData);
                            }
                            }
                            aria-readonly
                        />
                    </div>
                </div>
                {/* <div className="flex flex-row mt-2 items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <label className="text-base">Bnb Verified</label>
                        <p>
                            This means bnbIndia have verified your propert
                        </p>
                    </div>
                    <div>
                        <Switch
                            checked={formData.bnbVerified}
                            onCheckedChange={(checked: any) => {
                                setFormData((prevData: any) => {

                                    return { ...prevData, bnbVerified: !formData.bnbVerified };
                                });
                                // console.log(formData);
                            }
                            }
                            aria-readonly
                        />
                    </div>
                </div> */}

                <div className="flex flex-row mt-2 items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <label className="text-base">Listed</label>
                        <p>
                            Publish this property to customers.
                        </p>
                    </div>
                    <div>
                        <Switch
                            checked={formData.isListed}
                            onCheckedChange={(checked: any) => {
                                setFormData((prevData: any) => {

                                    return { ...prevData, isListed: !formData.isListed };
                                });
                                // console.log(formData);
                            }
                            }
                            aria-readonly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};





export const PriceDetails = ({ formData, setFormData }: any) => {
    console.log({ formData })
    const [pricePerGuest, setPricePerGuest] = useState(formData.pricePerGuest || '');
    const [pricePerDay, setPricePerDay] = useState(formData.pricePerDay || '');

    const handleGuestPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/\D/g, '');
        const intValue = parseInt(cleanedValue, 10);
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setPricePerGuest(formattedValue);
        setFormData((prevState: any) => ({
            ...prevState,
            pricePerGuest: intValue
        }));
    };

    const handleDayPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const cleanedValue = value.replace(/\D/g, '');
        const intValue = parseInt(cleanedValue, 10);
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setPricePerDay(formattedValue);
        setFormData((prevState: any) => ({
            ...prevState,
            pricePerDay: intValue
        }));
    };


    const [selectedBookingType, setSelectedBookingType] = useState(formData.bookingType || '');
    const [selectedCancellationType, setSelectedCancellationType] = useState(formData.cancellationType || '');

    const handleBookingTypeSelect = (type: string) => {
        setSelectedBookingType(type);
        setFormData((prevState: any) => ({
            ...prevState,
            bookingType: type
        }));
    };

    const handleCancellationTypeSelect = (type: any) => {
        setSelectedCancellationType(type)
        setFormData((prev: any) => ({
            ...prev,
            cancellationType: type
        }));
        // console.log(formData);

    };

    const isCancellationTypeSelected = (type: any) => selectedCancellationType === type ? 'bg-gray-200' : 'bg-white';
    const cancellationTypeIconColor = (type: any) => selectedCancellationType === type ? 'text-green-500' : 'text-gray-500';

    const isBookingTypeSelected = (type: string) => selectedBookingType === type ? 'bg-gray-200' : 'bg-white';
    const bookingTypeIconColor = (type: string) => selectedBookingType === type ? 'text-green-500' : 'text-gray-500';

    return (
        <div className="w-full mx-auto flex flex-col items-center justify-center p-6">
            <h1 className="mb-4 w-full text-2xl font-left font-bold">
                Price Details
            </h1>
            <p className="text-gray-600 w-full font-left mb-4 pb-3">
                Adjust the pricing details for your villa to match your preferences. You have the flexibility to update this information at any time.

            </p>
            <div className="flex flex-col gap-4 md:flex-row w-full justify-around">
                <div className="md:w-1/2 mx-2 p-6 bg-white rounded-lg border flex flex-col items-center">
                    <h1 className="mb-2 w-full text-md md:text-lg font-bold text-left">
                        Price (per Guest)
                    </h1>
                    <p className="text-gray-600 mb-4 text-left w-full">
                        Set the price you want to charge per guest. This can be modified whenever necessary.
                    </p>
                    <div className="flex items-center justify-center w-full">
                        <FaRupeeSign className="text-gray-600 text-3xl md:text-4xl mr-2" />
                        <input
                            className="bg-transparent text-center text-3xl md:text-5xl font-extrabold focus:outline-none w-full max-w-[200px] md:max-w-[300px]"
                            type="text"
                            id="pricePerGuest"
                            name="pricePerGuest"
                            value={pricePerGuest}
                            onChange={handleGuestPriceChange}
                            placeholder="Enter price"
                            inputMode="numeric"
                        />
                    </div>
                </div>

                <div className="md:w-1/2 mx-2 p-6 bg-white rounded-lg border flex flex-col items-center">
                    <h1 className="mb-2 w-full text-md md:text-lg font-bold text-left">
                        Price (per Day)
                    </h1>
                    <p className="text-gray-600 mb-4 text-left w-full">
                        Set the daily rate for your villa. You have the option to update this at any time.
                    </p>
                    <div className="flex items-center justify-center w-full">
                        <FaRupeeSign className="text-gray-600 text-3xl md:text-4xl mr-2" />
                        <input
                            className="bg-transparent text-center text-3xl md:text-5xl font-extrabold focus:outline-none w-full max-w-[200px] md:max-w-[300px]"
                            type="text"
                            id="pricePerDay"
                            name="pricePerDay"
                            value={pricePerDay}
                            onChange={handleDayPriceChange}
                            placeholder="Enter price"
                            inputMode="numeric"
                        />
                    </div>
                </div>
            </div>

            {/* <div className="w-full mx-auto flex flex-col items-center justify-center p-6"> */}
            <h1 className="mb-4 mt-9 w-full text-2xl font-left font-bold">
                Booking Type
            </h1>
            <p className="text-gray-600 w-full font-left mb-4 pb-3">
                Determine how you'd like to handle reservations for your villa. You have the option to automatically accept bookings or manually approve each request. This setting can be changed anytime to suit your preferences.
            </p>
            {/* <div className="w-full mx-auto h-[75vh] flex flex-col items-center justify-center p-4"> */}
            {/* <h1 className="mb-4 text-2xl font-bold">Decide how you'll confirm reservations</h1> */}
            <div className="w-full  flex flex-col space-y-4">
                <div
                    onClick={() => handleBookingTypeSelect('INSTANT')}
                    className={`flex items-center justify-between rounded-lg p-4 bg-white border cursor-pointer ${isBookingTypeSelected('INSTANT')}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedBookingType === 'INSTANT'}
                        onChange={() => handleBookingTypeSelect('INSTANT')}
                        className="mr-4"
                    />
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Use Instant Book</label>
                            <p className="text-sm text-gray-600">Guests can book automatically.</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${bookingTypeIconColor('INSTANT')}`} size={24} />
                </div>

                <div
                    onClick={() => handleBookingTypeSelect('REQUEST')}
                    className={`flex items-center justify-between rounded-lg p-4 bg-white border cursor-pointer ${isBookingTypeSelected('REQUEST')}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedBookingType === 'REQUEST'}
                        onChange={() => handleBookingTypeSelect('REQUEST')}
                        className="mr-4"
                    />
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Approve or decline requests</label>
                            <p className="text-sm text-gray-600">Guests must ask if they can book.</p>
                        </div>
                    </div>
                    <IoChatbubbleEllipsesOutline className={`${bookingTypeIconColor('REQUEST')}`} size={24} />
                </div>
            </div>
            {/* </div> */}
            {/* </div> */}

            <h1 className="mb-4 mt-9 w-full text-2xl font-left font-bold">
                Cancellation Type
            </h1>
            <p className="text-gray-600 w-full font-left mb-4 pb-3">
                Determine how you'd like to handle reservations for your villa. You have the option to automatically accept bookings or manually approve each request. This setting can be changed anytime to suit your preferences.
            </p>

            <div className="w-full  flex flex-col space-y-4">
                <div
                    onClick={() => handleCancellationTypeSelect('FIRM')}
                    className={`flex items-center justify-between rounded-lg p-4 bg-white border cursor-pointer ${isCancellationTypeSelected('FIRM')}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedCancellationType === 'FIRM'}
                        onChange={() => handleCancellationTypeSelect('FIRM')}
                        className="mr-4"
                    />
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Firm</label>
                            <p className="text-sm text-gray-600">30 days prior full refund</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${cancellationTypeIconColor('FIRM')}`} size={24} />
                </div>

                <div
                    onClick={() => handleCancellationTypeSelect('FLEXIBLE')}
                    className={`flex items-center justify-between rounded-lg p-4 bg-white border cursor-pointer ${isCancellationTypeSelected('FLEXIBLE')}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedCancellationType === 'FLEXIBLE'}
                        onChange={() => handleCancellationTypeSelect('FLEXIBLE')}
                        className="mr-4"
                    />
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Flexible</label>
                            <p className="text-sm text-gray-600">15 days prior full refund</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${cancellationTypeIconColor('FLEXIBLE')}`} size={24} />
                </div>

                <div
                    onClick={() => handleCancellationTypeSelect('RELAXED')}
                    className={`flex items-center justify-between rounded-lg p-4 bg-white border cursor-pointer ${isCancellationTypeSelected('RELAXED')}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedCancellationType === 'RELAXED'}
                        onChange={() => handleCancellationTypeSelect('RELAXED')}
                        className="mr-4"
                    />
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Relaxed</label>
                            <p className="text-sm text-gray-600">7 days prior full refund</p>
                        </div>
                    </div>
                    <IoChatbubbleEllipsesOutline className={`${cancellationTypeIconColor('RELAXED')}`} size={24} />
                </div>
            </div>

        </div>
    );
};
