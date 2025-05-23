"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getAllAmmenities } from "@/actions/listing/listing.action";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdClose } from "react-icons/md";

import { Switch } from "@/components/ui/switch";

import RangeSlider from "../RangeSlider"; // Uncomment this line when implementing the RangeSlider

const Filters = ({ toggleModal }: any) => {
  const [amenities, setAmenities] = useState<any[]>([]);

  // Fetch amenities on component mount
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAllAmmenities();
        setAmenities(data);
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
      }
    };

    fetchAmenities();
  }, []);

  const [filters, setFilters] = useState<any>({
    priceRange: [0, 100000],
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    placeType: "",
    family_only: "ALL",
    bnbVerified: "ALL",
    amenities: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryString = window.location.search; // Get the query string
      const query = new URLSearchParams(queryString);

      const updatedFilters = { ...filters };

      // Parse priceRange
      if (query.get("priceRange")) {
        const priceRange = query
          .get("priceRange")
          ?.split(",")
          .map((val) => parseInt(val, 10)) as [number, number];
        console.log("price ranfe is ", query.get("priceRange"), priceRange);

        if (priceRange?.length === 2) {
          updatedFilters.priceRange = priceRange;
          setValue(priceRange);
        }
      }

      // Parse bedrooms, bathrooms, and beds
      ["bedrooms", "bathrooms", "beds"].forEach((key: any) => {
        const value = query.get(key);
        if (value) {
          updatedFilters[key] = parseInt(value, 10) || 1;
        }
      });

      // Parse placeType
      if (query.get("placeType")) {
        updatedFilters.placeType = query.get("placeType") || "";
      }

      // Parse family_only and bnbVerified (booleans)
      ["family_only", "bnbVerified"].forEach((key: any) => {
        const value = query.get(key);
        if (value) {
          if (value === "ALL") {
            updatedFilters[key] = "ALL"; // Save "ALL" as it is
          } else if (value === "false") {
            updatedFilters[key] = false; // Save as false if "false"
          } else {
            updatedFilters[key] = true; // Save true for any other case (including "true")
          }
        }
      });

      // Parse amenities
      if (query.get("amenities")) {
        updatedFilters.amenities = query.get("amenities")?.split("+") || [];
      }

      setFilters(updatedFilters);
    }
  }, []);

  // useEffect(() => {
  //   console.log(filters); // Log the updated filters
  // }, [filters]);

  const handleFilterChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const [value, setValue] = useState<[number, number]>([
    filters["priceRange"][0],
    filters["priceRange"][1],
  ]);

  const amenitiesSelected = filters.amenities || [];
  const isAmenitySelected = (id: string) => {
    return amenitiesSelected.includes(id);
  };
  useEffect(() => {
    handleFilterChange({
      target: {
        name: "priceRange",
        value: [value[0], value[1]],
        type: "range",
      },
    });
    // console.log(filters);
  }, [value]);

  const router = useRouter();
  const toggleAmenity = (id: string) => {
    const updatedAmenities = amenitiesSelected.includes(id)
      ? amenitiesSelected?.filter((item: string) => item !== id)
      : [...amenitiesSelected, id];
    console.log("this is" + updatedAmenities);
    handleFilterChange({
      target: {
        name: "amenities",
        value: updatedAmenities,
        type: "amenities",
      },
    });
    console.log("toggle ammentinty wala filter", filters);
  };
  useEffect(() => {
    console.log("filter provided are ", filters);
  }, []);
  const updateUrlWithFilters = (filters: any) => {
    const url = new URL(
      typeof window !== "undefined" ? window.location.href : "/",
    );
    const params = new URLSearchParams(url.search);

    // Update numeric filters
    const numericFilters = ["bedrooms", "bathrooms", "beds"];
    numericFilters.forEach((filter) => {
      if (filters[filter] !== undefined) {
        params.set(filter, filters[filter]);
      }
    });

    // Update other filters
    const otherFilters = [
      "location",
      "priceRange",
      "propertyType",
      "placeType",
    ];
    otherFilters.forEach((filter) => {
      if (filters[filter] !== undefined) {
        params.set(filter, filters[filter]);
      }
    });

    // Update boolean amenities

    const existingAmenities = params.get("amenities")?.split("+") || [];
    const newAmenities = filters.amenities || [];
    const updatedAmenities = new Set([...existingAmenities, ...newAmenities]);

    if (updatedAmenities.size > 0) {
      params.set("amenities", Array.from(updatedAmenities).join("+"));
    } else {
      params.delete("amenities");
    }

    // Update boolean filters
    const booleanFilters = ["family_only", "bnbVerified"];
    booleanFilters.forEach((filter) => {
      if (filters[filter] !== undefined) {
        params.set(filter, filters[filter]);
      }
    });

    // Update the URL
    if (typeof window !== "undefined") {
      window.history.replaceState(
        {},
        "",
        `${url.pathname}?${params.toString()}`,
      );
    }
  };

  const onApplyFilters = () => {
    console.log("On Apply Toggle", filters);
    updateUrlWithFilters(filters);
    toggleModal();
  };
  // const onClearFilters = () => {
  //   onclearFilters();
  //   updateUrlWithFilters({
  //     priceRange: [0, 100000],
  //     bedrooms: 1,
  //     bathrooms: 1,
  //     beds: 1,
  //     amenities: [],
  //   });
  // };
  const onClearFilters = () => {
    const defaultFilters = {
      priceRange: [0, 100000],
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      placeType: "",
      amenities: [],
      familyOnly: "ALL",
      bnbVerified: "ALL",
    };
    setValue([0, 100000]);
    setFilters(defaultFilters);

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete("priceRange");
    params.delete("bedrooms");
    params.delete("bathrooms");
    params.delete("beds");
    params.delete("placeType");
    params.delete("amenities");
    params.delete("familyOnly");
    params.delete("bnbVerified");
    params.delete("listed");

    url.search = params.toString();
    window.history.replaceState(null, "", url);
  };

  const handleFamilyToggle = () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      family_only:
        prevFilters.family_only === "ALL" || prevFilters.family_only === false
          ? true
          : false,
    }));
  };

  const handlebnbVerifiedToggle = () => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      bnbVerified:
        prevFilters.bnbVerified === "ALL" || prevFilters.bnbVerified === false
          ? true
          : false,
    }));
  };

  const [showAll, setShowAll] = useState(false);
  const [listedAmenities, setListedAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch amenities using useEffect
  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      const data = await getAllAmmenities();
      setListedAmenities(data);
      setLoading(false);
    };

    fetchAmenities();
  }, []);

  return (
    <div className="bg-white border-[1px]   h-full rounded-[20px] w-full ">
      <div className="flex items-center  p-8 py-4 justify-between border-b-[1px] ">
        <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
        <button
          className="text-gray-600 hover:text-gray-800 transition"
          onClick={toggleModal}
        >
          <MdClose size={24} />
        </button>
      </div>
      <div className="max-h-[83%] p-8 py-4 overflow-y-scroll display-no-scroll">
        {/* <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Type of Place</h3>
          <p className="text-gray-600">Choose type of place</p>

          <div className="flex max-w-[95%] mt-3 p-1 border border-gray-300 rounded-md mx-auto justify-between items-center bg-gray-100 shadow-sm">
            <div
              className={`p-2 h-full px-3 w-[32%] sm:text-sm text-center font-semibold rounded-md cursor-pointer transition-all duration-200
        ${filters.placeType === "room" ? "bg-white border border-gray-300" : "hover:bg-gray-200"}`}
              onClick={() =>
                handleFilterChange({
                  target: { name: "placeType", value: "room" },
                })
              }
            >
              Room
            </div>
            <div
              className={`p-2 px-3 w-[32%] text-center sm:text-sm  font-semibold rounded-md cursor-pointer transition-all duration-200
        ${filters.placeType === "entire" ? "bg-white border border-gray-300 " : "hover:bg-gray-200"}`}
              onClick={() =>
                handleFilterChange({
                  target: { name: "placeType", value: "entire" },
                })
              }
            >
              Entire Place
            </div>
            <div
              className={`p-2 px-3 w-[32%] text-center sm:text-sm  font-semibold rounded-md cursor-pointer transition-all duration-200
        ${filters.placeType === "any" ? "bg-white border border-gray-300" : "hover:bg-gray-200"}`}
              onClick={() =>
                handleFilterChange({
                  target: { name: "placeType", value: "any" },
                })
              }
            >
              Any Type
            </div>
          </div>
        </div> */}

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Budget</h3>
          <p className="text-gray-600">Nightly prices before fees and taxes</p>
          <div className="flex w-full justify-center items-center mt-4 mb-2">
            <RangeSlider value={value} setValue={setValue} />
          </div>
          <div className="flex max-w-[90%] mt-3 mx-auto justify-between items-center">
            <p className="text-gray-500 text-md border rounded-xl p-1  px-3">
              ₹{value[0]}
            </p>
            <p className="text-gray-500 text-md border rounded-xl p-1 px-3">
              ₹{value[1]}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Amenities</h2>
          <p className="mb-4 text-gray-600">Select your preferred amenities</p>

          {/* Loader */}
          {loading ? (
            <div className="py-2 flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="w-24 h-8 bg-gray-300 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {(showAll ? listedAmenities : listedAmenities.slice(0, 14)).map((amenity: any) => (
                <div
                  key={amenity.amenity_id}
                  onClick={() => toggleAmenity(amenity.amenity_name)}
                  className={`flex items-center rounded-xl p-1 px-3 text-gray-700 justify-center space-x-2 cursor-pointer
                                ${isAmenitySelected(amenity.amenity_name) ? "border-pink-500 border shadow-md" : "border shadow-sm hover:border-pink-300"}`}
                >
                  <button
                    type="button"
                    className="p-1 bg-transparent focus:outline-none"
                  >
                    <div
                      className={`text-xs ${isAmenitySelected(amenity.amenity_name) ? "text-pink-500" : "text-gray-700"}`}
                    >
                      <Image
                        src={amenity.amenity_image}
                        alt={amenity.label || "Amenity"}
                        width={32} // Set the width for the image
                        height={32} // Set the height for the image
                      />{" "}
                      {/* Keep the icon here */}
                    </div>
                  </button>
                  <span
                    className={`text-sm ${isAmenitySelected(amenity.amenity_name) ? "text-gray-800 font-semibold" : "text-gray-500"}`}
                  >
                    {amenity.amenity_name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Toggle Show More / Show Less */}
          {listedAmenities.length > 14 && !loading && (
            <button
              className="my-1 underline font-semibold text-lg"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* <hr className="mb-4 border-gray-300 border-t-[0.5px] opacity-75" /> */}

        <div className="my-4">
          <p className="text-xl mb-4 font-bold text-gray-800">Rooms and Beds</p>

          {["bedrooms", "beds", "bathrooms"].map((type: any) => (
            <div
              key={type}
              className="mb-4 flex w-full items-center justify-between"
            >
              <h3 className="text-lg font-semibold w-[70%]  text-gray-700">{`Number of ${type.charAt(0).toUpperCase() + type.slice(1)}`}</h3>
              <div className="flex w-[30%] items-center space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      target: {
                        name: type,
                        value: Math.max(filters[type] - 1, 0),
                        type: "number",
                      },
                    })
                  }
                  className="p-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none hover:bg-gray-300 transition"
                >
                  <AiOutlineMinus size={18} />
                </button>
                <div className="w-16 text-center rounded-md p-2 bg-white text-gray-700">
                  {filters[type] >= 0 ? filters[type] : 0}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleFilterChange({
                      target: {
                        name: type,
                        value: filters[type] + 1,
                        type: "number",
                      },
                    })
                  }
                  className="p-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none hover:bg-gray-300 transition"
                >
                  <AiOutlinePlus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-xl mb-4 font-bold text-gray-800">Other Details</p>

          <div className="mx-auto bg-white rounded-lg">
            {/* Family Only Option */}
            <div className="flex flex-row mt-5 items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base">Family Only</label>
                <p>This property is exclusively available for families.</p>
              </div>
              <div>
                <Switch
                  name="family_only"
                  checked={filters.family_only === true} // Show checked state only if true
                  onCheckedChange={() => handleFamilyToggle()} // Use the toggle function
                  aria-readonly
                />
              </div>
            </div>

            {/* Bnb Verified Option */}
            <div className="flex flex-row mt-2 items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-base">Bnb Verified</label>
                <p>This property has been verified by bnbIndia.</p>
              </div>
              <div>
                <Switch
                  name="bnbVerified"
                  checked={filters.bnbVerified === true}
                  onCheckedChange={() => handlebnbVerifiedToggle()} // Use the toggle function
                  aria-readonly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <hr className="my-2 border-gray-300" /> */}

      <div className="flex border-t-[1px] rounded-b-[15px] justify-between p-8 py-4 shadow-t-lg bg-white items-center ">
        <button
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none `}
          onClick={onClearFilters} // Ensure to define the onClearFilters function
        >
          Clear All
        </button>
        <button
          className={`px-4 py-2 red-gradient  text-gray-100 rounded-md  focus:outline-none  `}
          onClick={onApplyFilters} // Ensure to define the onApplyFilters function
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;

// Decide how you'll confirm reservations
// Use Instant Book
// Guests can book automatically.

// Approve or decline requests

// Family Only
// Only family will be able to book this property

// Bnb Verified
// This means bnbIndia have verified your propert

// Listed
// Publish this property to customers.

// https://www.airbnb.co.in/s/Jabalpur--Madhya-Pradesh/homes?flexible_trip_lengths%5B%5D=one_week&date_picker_type=flexible_dates&place_id=ChIJfam2DxqugTkRueNDvBYGAkQ&refinement_paths%5B%5D=%2Fhomes&search_type=filter_change&tab_id=home_tab&query=Jabalpur%2C%20Madhya%20Pradesh&monthly_start_date=2024-11-01&monthly_length=3&monthly_end_date=2025-02-01&search_mode=regular_search&price_filter_input_type=0&price_filter_num_nights=5&channel=EXPLORE&amenities%5B%5D=33&amenities%5B%5D=4&amenities%5B%5D=9

// https://www.airbnb.co.in/s/India/homes?refinement_paths%5B%5D=%2Fhomes&place_id=ChIJkbeSa_BfYzARphNChaFPjNc&tab_id=home_tab&query=India&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2024-12-01&monthly_length=3&monthly_end_date=2025-03-01&search_mode=regular_search&price_filter_input_type=0&channel=EXPLORE&amenities%5B%5D=33&search_type=filter_change
