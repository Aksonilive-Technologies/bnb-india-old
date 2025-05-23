'use client'
// components/SearchBar.tsx
import { useState, useEffect } from 'react';
import { fetchDistinctLocations } from '@/actions/listing/listing.action'
import { FaMapMarkerAlt } from 'react-icons/fa';


interface DropdownSearchBarProps {
  locationValue: string;
  setLocationValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchModal?: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownSearchBar: React.FC<DropdownSearchBarProps> = ({ locationValue, setLocationValue, setSearchModal}) => {
  //   const [locationValue, setLocationValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [villaLocations, setVillaLocations] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await fetchDistinctLocations();
        setVillaLocations(locations); // Update state with fetched locations
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Handle error as needed (e.g., show error message)
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const filteredSuggestions = villaLocations
      .filter((item) =>
        item.toLowerCase().includes(locationValue.toLowerCase())
      )
      .slice(0, 7);

    setSuggestions(filteredSuggestions);
  }, [locationValue]);

  return (
    <div className=" exclude-class w-full z-[1000] m-0 max-w-md mx-auto bg-transparent">
      <input
        type="text"
        className="w-full bg-transparent rounded-md focus:outline-none  text-gray-600"
        placeholder="search anywhere..."
        value={locationValue}
        onChange={(e) => setLocationValue(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delayed to allow click event on suggestion
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute exclude-class w-[300px] mt-5  p-4 shadow-md py-5 z-[1000] bg-white border-gray-200 border-[1px] rounded-3xl  overflow-y-auto ">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-center px-4 py-3 m-1 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-white transition-all duration-200 ease-in-out   last:border-none"
              onMouseDown={() => {
                setLocationValue(suggestion);
                setShowSuggestions(false);
                if (setSearchModal) {
                  setSearchModal("checkin"); // Only call if setSearchModal exists
                }
              }}
            >
              <FaMapMarkerAlt className="mr-3 text-gray-500 text-lg" />
              <span className="text-gray-700 font-semibold">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearchBar;
