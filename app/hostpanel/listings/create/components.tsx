import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { FaHome, FaDoorOpen, FaUsers } from 'react-icons/fa';
import { RxCross2 } from "react-icons/rx";
import { BsLightningCharge } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


export const Introduction = () => {
    return (
        <div className="w-full h-[75vh] flex flex-col md:flex-row">
            <div className="w-full md:w-[40%] flex items-center justify-around h-full p-8">
                <p className="text-[25px] md:text-[40px] font-bold text-left font-sans">
                    Getting Started with Us is Simple
                </p>
            </div>
            <div className="w-full md:w-[60%] flex flex-col gap-[10px] items-center justify-center h-full p-3">
                <div className="w-full gap-[5px] md:gap-[20px] bg-white p-1 rounded-lg flex items-center justify-center">
                    <div>
                        <p className="text-[17px] md:text-[20px] font-bold">
                            1. Describe Your Space
                        </p>
                        <p className="text-[13px] md:text-[15px] text-gray-500 mt-2">
                            Provide essential details about your property, including its location and the number of guests it can accommodate.
                        </p>
                    </div>
                    <div className="h-[150px] w-[350px] flex items-center justify-center">
                        <Image
                            src="/3d-rendering-cartoon-house.png"
                            alt="Describe Your Space"
                            width={250}
                            height={250}
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                </div>
                {/* Repeat similar structure for other cards */}
                {/* Card 2 */}
                <div className="w-full gap-[5px] md:gap-[20px] md:ml-[100px] bg-white p-1 rounded-lg flex items-center justify-center">
                    <div className="h-[150px] w-[350px] flex items-center justify-center">
                        <Image
                            src="/3d-rendering-isometric-house-model.png"
                            alt="Showcase Your Place"
                            width={250}
                            height={250}
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                    <div>
                        <p className="text-[17px] md:text-[20px] font-bold">
                            2. Showcase Your Place
                        </p>
                        <p className="text-[13px] md:text-[15px] text-gray-500 mt-2">
                            Upload at least 5 high-quality photos and craft an engaging title and description. We’ll guide you through the process.
                        </p>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="w-full gap-[5px] md:gap-[20px] bg-white p-1 rounded-lg flex items-center justify-center">
                    <div>
                        <p className="text-[17px] md:text-[20px] font-bold">
                            3. Complete and Publish
                        </p>
                        <p className="text-[15px] text-gray-500 mt-2">
                            Decide if you want to host an experienced guest first, set an initial price, and publish your listing.
                        </p>
                    </div>
                    <div className="h-[150px] w-[350px] flex items-center justify-center">
                        <Image
                            src="/three-dimensional-house-model.jpg"
                            alt="Complete and Publish"
                            width={250}
                            height={250}
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export const StepOne = () => {
    return (
        <div className="w-full  h-[75vh] mt-[10vh] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-[40%] flex flex-col items-left justify-center gap-[5px] h-full p-8  rounded-lg">
                <p className="text-[18px] md:text-[15px] font-bold text-left font-sans text-gray-700">Step One</p>
                <p className="text-[33px] md:text-[25px] font-semibold text-left font-sans text-gray-900">
                    Tell Us About Your Place
                </p>
                <p className="text-[17px] text-gray-700">
                    During this step, we'll inquire about your property type and whether guests will book the entire place or just a room. Please provide details about the location and the number of guests your place can accommodate.
                </p>
            </div>
            <div className="relative w-full md:w-[60%] h-full p-3 flex items-center justify-center">
                {/* <div className="absolute inset-0 bg-gray-200 rounded-lg"></div> */}
                <div className="h-[300px] md:h-[450px] w-[450px] flex items-center justify-center overflow-hidden rounded-lg">
                    <Image
                        src="/3d-rendering-house-model.png"
                        alt="Describe Your Space"
                        layout="responsive"
                        width={350}
                        height={350}

                        className="rounded-lg"


                        style={{ objectFit: 'cover' }}

                    />
                </div>
            </div>
        </div>
    );
}

export const StepTwo = () => {

    return (
        <div className="w-full mt-[10vh]  h-[75vh] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-[40%] flex flex-col items-left justify-center gap-[10px] h-full p-8  rounded-lg">
                <p className="text-[18px] md:text-[15px] font-bold text-left font-sans text-gray-700">Step Two</p>
                <p className="text-[33px] md:text-[25px] font-semibold text-left font-sans text-gray-900">
                    Make your place stand out
                </p>
                <p className="text-[17px] text-gray-700">
                    In this step, you'll add some of the amenities your place
                    offers, plus 5 or more photos. Then you'll create a title and
                    description,
                </p>
            </div>
            <div className="relative w-full md:w-[60%] h-full p-3 flex items-center justify-center">
                {/* <div className="absolute inset-0 bg-gray-200 rounded-lg"></div> */}
                <div className="h-[300px] md:h-[450px] w-[450px] flex items-center justify-center overflow-hidden rounded-lg">
                    <Image
                        src="/3d-rendering-isometric-house.png"
                        alt="Describe Your Space"
                        layout="responsive"
                        width={350}
                        height={350}
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}

export const StepThree = () => {
    return (
        <div className="w-full  h-[75vh] mt-[10vh] flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-[40%] flex flex-col items-left justify-center gap-[5px] h-full p-8  rounded-lg">
                <p className="text-[18px] md:text-[15px] font-bold text-left font-sans text-gray-700">Step Three</p>
                <p className="text-[33px] md:text-[25px] font-semibold text-left font-sans text-gray-900">

                    Finish up and publish

                </p>
                <p className="text-[17px] text-gray-700">
                    Finally, you'll choose booking settings, set UP pricing and publish your
                    listing.
                </p>
            </div>
            <div className="relative w-full md:w-[60%] h-full p-3 flex items-center justify-center">
                {/* <div className="absolute inset-0 bg-gray-200 rounded-lg"></div> */}
                <div className="h-[300px] md:h-[450px] w-[450px] flex items-center justify-center overflow-hidden rounded-lg">
                    <Image
                        src="/three-dimensional-house-model.jpg"
                        alt="Describe Your Space"
                        layout="responsive"
                        width={350}
                        height={350}
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}
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

    const [zoom, setZoom] = useState(1);
    const [url, setUrl] = useState('');

    function extractCoordinates(url: string) {
        try {
            const regex = /@(\d+\.\d+),(\d+\.\d+)/;
            const match = url.match(regex);
            
            if (match && match.length >= 3) {
                const coordinates = {
                    latitude: parseFloat(match[1]),
                    longitude: parseFloat(match[2]),
                };
                setFormData((prevState: any) => ({ ...prevState, coordinate: [coordinates.latitude, coordinates.longitude] }));
                return coordinates;
            }
            return null;
        } catch (error) {
            console.error("Error extracting coordinates:", error);
            return null;
        }
    }

    const handleUrlChange = (e: any) => {
        setUrl(e.target.value);
    };

    const handleFetchCoordinates = () => {
        extractCoordinates(url);
    };

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4">
            <h1 className="mb-4 text-2xl font-bold">
                Where's your place located?
            </h1>
            <p className="text-gray-600 mb-4">
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
            <div className="w-full h-full max-w-4xl rounded-lg overflow-hidden shadow-md mt-4">
                <DynamicMap
                    zoom={zoom}
                    position={formData.coordinate}
                    formData={formData}
                    setFormData={setFormData}
                />
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
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw]  justify-center p-4">
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
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Share some basics about your place</h1>
            <p className="text-gray-600 mb-4  pb-3">
                You'll add more details later, such as bed types.
            </p>

            <div className="flex items-center border-b pb-3 justify-between mb-6">
                <label className="text-lg font-semibold">Number of Bedrooms:</label>
                <div className="flex  items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBedrooms')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>

                    <input
                        type="text"
                        name="numberOfBedrooms"
                        value={formData.numberOfBedrooms}
                        onChange={handleChange}
                        className="w-16 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    {/* <div className="w-16 px-3 py-1 border border-gray-300 rounded-md text-center">{formData.numberOfBedrooms}</div> */}
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBedrooms')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>

            <div className="flex items-center border-b pb-3 justify-between mb-6">
                <label className="text-lg font-semibold">Number of Bathrooms:</label>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBathrooms')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="numberOfBathrooms"
                        value={formData.numberOfBathrooms}
                        onChange={handleChange}
                        className="w-16 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBathrooms')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>

            <div className="flex items-center border-b pb-3 justify-between mb-6">
                <label className="text-lg font-semibold">Number of Beds:</label>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => handleDecrement('numberOfBeds')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        name="numberOfBeds"
                        value={formData.numberOfBeds}
                        onChange={handleChange}
                        // className="w-full h-full text-center outline-none"
                        className="w-16 px-3 py-1 border border-gray-300 rounded-md text-center focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleIncrement('numberOfBeds')}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </div>
        </div>
    );
};



export const Ammenity = ({ formData, setFormData, setIsDataValid }: any) => {
   
    const [amenities, setAmenities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loader state

    useEffect(() => {
        console.log("Checking amenities on page load", formData.amenity_name);
    
        if (!Array.isArray(formData.amenity_name) || formData.amenity_name.length === 1) {
            setIsDataValid(false);
        } 
    }, []);
    

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



    const toggleAmenity = (id: string) => {
        setFormData((prevData: any) => {
            const updatedAmenities = prevData.amenity_name
                ? prevData.amenity_name.includes(id)
                    ? prevData.amenity_name.filter((item: string) => item !== id)
                    : [...prevData.amenity_name, id]
                : [id]; // Initialize as an array if undefined
    
            setIsDataValid(updatedAmenities.length > 1); // Validate based on amenities
    
            return {
                ...prevData,
                amenity_name: updatedAmenities,
            };
        });
    };
    
    

    const isAmenitySelected = (id: string) => formData.amenity_name.includes(id);

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Tell guests what your place has to offer</h1>
            <p className="text-gray-600 mb-4 pb-3">
                You can add more amenities after you publish your listing.
            </p>
            <div className="flex flex-wrap gap-4">
                {
                loading?
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
                amenities.map((amenity: any) => (
                    <div
                        key={amenity.amenity_id}
                        onClick={() => toggleAmenity(amenity.amenity_name)}
                        className={`text-[1rem] flex items-center rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                            ${isAmenitySelected(amenity.amenity_name)
                                ? 'border-pink-500 border  shadow-md'
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
                                    className={`${isAmenitySelected(amenity.amenity_name) ? 'border-pink-500' : 'border-gray-300'}`}
                                />
                        </button>
                        <span className={`${isAmenitySelected(amenity.amenity_name) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                            {amenity.amenity_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PropertyCategory = ({ formData, setFormData, setIsDataValid }: any) => {
   
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loader state

    useEffect(() => {
        console.log("Form data in category", formData.category_code);
        
        if (!formData.category_code || formData.category_code.length === 0) {
            setIsDataValid(false);
        }
    
        console.log("Log in category 1", setIsDataValid);
    }, []); 
    

    // Fetch amenities on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await getAllCategories();
                console.log({data})
                setCategories(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);



    const toggleCategory = (id: string) => {
        setFormData((prevData: any) => {
            const updatedCategories = prevData.category_code
                ? prevData.category_code.includes(id)
                    ? prevData.category_code.filter((item: string) => item !== id)
                    : [...prevData.category_code, id]
                : [id];
    
            setIsDataValid(updatedCategories.length > 0); // Set true if at least one category is selected, else false
            return {
                ...prevData,
                category_code: updatedCategories,
            };
        });
    };
    
    
    const isCategorySelected = (id: string) => 
        Array.isArray(formData.category_code) && formData.category_code.includes(id);
    

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Select categories that best describe your place</h1>
            <p className="text-gray-600 mb-4 pb-3">
                You can add more categories after you publish your listing.
            </p>
            <div className="flex flex-wrap gap-4">
                {
                loading?
                (
                    <div className="py-2 flex flex-wrap gap-2">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-24 h-10 bg-gray-300 animate-pulse"
                        />
                      ))}
                    </div>
                  )
                :
                categories.map((category: any) => (
                    <div
                        key={category.category_id}
                        onClick={() => toggleCategory(category.category_code)}
                        className={`flex items-center text-[1rem] rounded-md p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                            ${isCategorySelected(category.category_code)
                                ? 'border-pink-500 border  shadow-md'
                                : 'border shadow-sm'
                            }`}
                    >
                        <button
                            type="button"
                            className="p-1 rounded-lg bg-transparent focus:outline-none"
                        >
                            <Image
                                    src={category.category_image}
                                    alt={category.label || "Category"}
                                    width={32} // Set the width for the image
                                    height={32} // Set the height for the image
                                    className={`${isCategorySelected(category.category_code) ? 'border-pink-500' : 'border-gray-300'}`}
                                />
                        </button>
                        <span className={`${isCategorySelected(category.category_code) ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                            {category.category_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const TitlePage = ({ formData, setFormData, setIsDataValid }: any) => {

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setIsDataValid(value.trim() !== "");
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    };

    useEffect(() => {
        console.log("Form data", formData.title)
        if(!formData.title)
            setIsDataValid(false)
      }, []);



    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4  border-gray-300">
            <h1 className="mb-4 text-2xl font-bold">Tell guests what your place has is called</h1>
            <p className="text-gray-600 mb-4 pb-3">
                Short titles work best. Have fun with it - YOU can always change it later.
            </p>
            <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Name of your Villa</span>
                <input
                    className="field__input bg-transparent text-lg font-bold focus:outline-none"
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

export const DescriptionPage = ({ VillaDescription, setVillaDescription, setIsDataValid }: any) => {
    const RichTextEditor = useMemo(() => dynamic(
        () => import('@/components/shared/Description'),
        {
            loading: () => <p>Descption is loading</p>,
            ssr: false
        }
    ), [])
    const onChange = (e: any) => {

        setIsDataValid(e.trim() !== "");
        setVillaDescription((prev: any) => ({
            ...prev,
            description: e,
        }));
    };

    useEffect(() => {
        console.log("Desc Form data", VillaDescription)
        if(!VillaDescription)
            setIsDataValid(false)
      }, []);

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-left md:w-[55vw] justify-center p-4  border-gray-300">
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

export const UploadImage = ({ images, setImages, profilePic, setProfilePic }: any) => {


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => ({
                file,
                image_url: URL.createObjectURL(file),
                imageData: URL.createObjectURL(file),
                // isCover: false
            }));
            setImages((prevImages: any) => prevImages.concat(filesArray));
        }
    };

    const removeImage = async (id: string, type: string) => {
        setImages((prevImages: any) =>
            prevImages.filter((image: any) => image.image_url !== id)
        );
    };



    const handleCoverChange = (url: any, nextType: any) => {

        setProfilePic(url);
    };

    return (
        <div className="w-full mx-auto mt-5 min-h-[65vh] flex flex-col items-left justify-center p-4 border-gray-300">
            <h1 className="mb-4 text-2xl font-bold text-left">Add some photos of your house</h1>

            <div className="flex flex-col md:flex-row gap-10">
                {/* Image Upload Section */}
                <div className="flex flex-col w-full md:w-2/3">
                    <label htmlFor="images" className="block text-gray-700 font-semibold mb-2 text-left">
                        Upload Images
                    </label>
                    <p className="text-gray-400 mt-4 font-semibold  mb-4 text-left">
                        * You'll need <span className="font-bold">5 photos</span> to get started. You can add more or make changes later.
                    </p>
                    <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start  max-h-[400px]  overflow-y-auto no-scrollbar">
                        <div className="w-40 h-40 flex items-center justify-center border-2 border-dotted border-gray-300 rounded-md cursor-pointer relative">
                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            <AiOutlinePlus size={30} className="text-gray-500" />
                        </div>
                        {images.map((image: any, index: any) => (
                            <div key={index} className="flex flex-col items-center shadow-lg rounded-md overflow-hidden border relative w-40 h-40">
                                <Image
                                    onClick={() => handleCoverChange(image.image_url, 'local')}
                                    src={image.image_url}
                                    alt={`img-${index}`}
                                    width={600}
                                    height={600}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    onClick={() => removeImage(image.image_url, 'NotUploaded')}
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
                        {/* {uploadImage.map((image: any, index: any) => (
                            <div key={index} className="flex flex-col items-center shadow-lg rounded-md overflow-hidden border relative w-40 h-40">
                                <Image
                                    onClick={() => handleCoverChange(image.image_url, 'db')}
                                    src={image.image_url}
                                    alt={`img-${index}`}
                                    fill
                                    sizes="(max-width: 768px) 10rem, 11rem"
                                    style={{ objectFit: 'cover' }}
                                />
                                <button
                                    onClick={() => removeImage(image.villaImage_uid, 'uploaded')}
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
                        ))} */}
                    </div>

                </div>
                {/* Cover Image Section */}
                <div className="w-full md:w-1/3">
                    <label htmlFor="cover" className="block text-gray-700 font-semibold mb-2 text-left">
                        Cover Photo
                    </label>
                    <p className="text-gray-400 mt-4 font-semibold  mb-4 text-left">
                        * This image will be the main photo for your listing.
                    </p>
                    <div className="w-full h-[300px] flex items-center overflow-hidden rounded-md relative border-2 border-gray-300 shadow-lg">
                        {profilePic ? (
                            <Image
                                src={profilePic}
                                alt="Profile Pic"
                                width={400}
                                height={400}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">No cover image selected</p>
                            </div>
                        )}
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
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center md:w-[55vw] justify-center p-4">
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
    className="flex items-center justify-between rounded-lg border p-4 bg-white shadow-md opacity-50 pointer-events-none"
>
    <div className="flex items-center space-x-4">
        <div>
            <label className="text-lg font-medium text-gray-400">Approve or decline requests</label>
            <p className="text-sm text-gray-500">Guests must ask if they can book.(Feature coming soon...)</p>
        </div>
    </div>
    <IoChatbubbleEllipsesOutline className="text-gray-400" size={24} />
</div>

            </div>
        </div>
    );
};

export const TypeOfCancellation = ({ formData, setFormData }: any) => {

    const handleSelect = (type: any) => {
        setFormData((prev: any) => ({
            ...prev,
            cancellationType: type
        }));
        // console.log(formData);

    };

    const isSelected = (type: any) => formData.cancellationType === type ? 'border-pink-500' : 'border-gray-300';
    const iconColor = (type: any) => formData.cancellationType === type ? 'text-pink-500' : 'text-gray-700';

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center md:w-[55vw] justify-center p-4">
            <h1 className="mb-4 text-2xl font-bold">Decide how you'll confirm reservations</h1>
            <div className="w-full md:w-[500px] flex justify-between flex-col space-y-4">
                <div
                    onClick={() => handleSelect('FIRM')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('FIRM')}`}
                >
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Firm</label>
                            <p className="text-sm text-gray-600">30 days prior full refund</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${iconColor('FIRM')}`} size={24} />
                </div>

                <div
                    onClick={() => handleSelect('FLEXIBLE')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('FLEXIBLE')}`}
                >
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Flexible</label>
                            <p className="text-sm text-gray-600">15 days prior full refund</p>
                        </div>
                    </div>
                    <BsLightningCharge className={`${iconColor('FLEXIBLE')}`} size={24} />
                </div>

                <div
                    onClick={() => handleSelect('RELAXED')}
                    className={`flex items-center justify-between rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer ${isSelected('RELAXED')}`}
                >
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Relaxed</label>
                            <p className="text-sm text-gray-600">7 days prior full refund</p>
                        </div>
                    </div>
                    <IoChatbubbleEllipsesOutline className={`${iconColor('RELAXED')}`} size={24} />
                </div>
            </div>
        </div>
    );
};


import { FaRupeeSign } from 'react-icons/fa';


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

import { Switch } from "@/components/ui/switch";
import { deleteImage, getAllAmmenities, getAllCategories } from "@/actions/listing/listing.action";
import { log } from "console";

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



export const Congo = ({ formData }: any) => {
    const { villaTitle } = formData; // Assuming formData contains the title of the villa

    return (
        <div className="w-full mx-auto h-[75vh] flex flex-col items-center justify-center md:w-[50vw] p-4 border-gray-300">
            <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
            <p className="text-gray-600 mb-6">
                Thank you for trusting us with "{villaTitle}". Your property has been successfully added to our website.
            </p>
            <p className="text-gray-600">
                We appreciate your contribution and look forward to helping you connect with guests.
            </p>
        </div>
    );
};


export const StatusBar = ({ currentStep, totalSteps }: any) => {
    const calculateProgress = (id: number) => {
        if (id === 1) {
            // First segment: steps 1 to 6
            if (currentStep <= 6) {
                return ((currentStep - 1) / 5) * 100;
            } else {
                return 100;
            }
        } else if (id === 2) {
            // Second segment: steps 7 to 11
            if (currentStep <= 7) {
                return 0;
            }
            else if (currentStep <= 12) {
                return ((currentStep - 6) / 6) * 100;
            } else {
                return 100;
            }
        } else if (id === 3) {
            // Third segment: steps 12 onward
            if (currentStep <= 13) {
                return 0;
            }
            else if (currentStep <= totalSteps) {
                return ((currentStep - 12) / (totalSteps - 12)) * 100;
            } else {
                return 100;
            }
        }

        return 0;
    };



    return (
        <div className="w-full  rounded-full">
            <div className="flex gap-[10px]">
                {/* First part of StatusBar */}
                <div className={`flex-1  h-1 bg-gray-300 rounded-sm  `} style={{ width: `${(6 / totalSteps) * 100}%` }}>
                    <div
                        className="h-full red-gradient rounded-full"
                        style={{ width: `${calculateProgress(1)}%` }}
                    />
                </div>
                {/* First part of StatusBar */}
                <div className={`flex-1 h-1 bg-gray-300 rounded-sm  `} style={{ width: `${(6 / totalSteps) * 100}%` }}>
                    <div
                        className="h-full red-gradient rounded-full"
                        style={{ width: `${calculateProgress(2)}%` }}
                    />
                </div>
                {/* First part of StatusBar */}
                <div className={`flex-1 h-1 bg-gray-300 rounded-sm  `} style={{ width: `${(6 / totalSteps) * 100}%` }}>
                    <div
                        className="h-full red-gradient rounded-full"
                        style={{ width: `${calculateProgress(3)}%` }}
                    />
                </div>

            </div>
        </div>
    );
};