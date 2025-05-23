'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import RangeSlider from '../RangeSlider';

interface PopupFiltersProps {
  filters: any;
  handleFilterChange: (e: any) => void;
  onApplyFilters: (filters: any) => void;
}

const amenities = [
  { name: 'pool', label: 'Pool' },
  { name: 'garden', label: 'Garden' },
  { name: 'wifi', label: 'Wifi' },
  { name: 'staff', label: 'Staff' },
  { name: 'ac', label: 'AC' },
  { name: 'chef', label: 'Chef' },
  { name: 'heater', label: 'Heater' },
  { name: 'kitchen', label: 'Kitchen' },
  { name: 'parking', label: 'Parking' },
  { name: 'snooker', label: 'Snooker' }
];

const PopupFilters: React.FC<PopupFiltersProps> = ({ filters, handleFilterChange, onApplyFilters }) => {
  const [value, setValue] = useState<[number, number]>([filters['priceRange'][0], filters['priceRange'][1]]);

  useEffect(() => {
    handleFilterChange(
      {
        target: {
          name: 'priceRange',
          value: [value[0], value[1]],
          type: 'range'
        }
      });
  }, [value]);

  return (
    <div className="bg-white p-4 px-6 rounded-lg  drop-shadow-2xl w-full ">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Amenities</h3>
        <div className='grid grid-cols-2'>
          {amenities.map((amenity) => (
            <label className="flex items-center" key={amenity.name}>
              <input
                type="checkbox"
                name={amenity.name}
                checked={filters[amenity.name]}
                onChange={handleFilterChange}
                className='h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer'
              />
              <span className="ml-2">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Budget</h3>
        <div className="flex items-center mb-2">
          <RangeSlider value={value} setValue={setValue} />
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Number of Bedrooms</h3>
        <input
          type="number"
          name="bedrooms"
          value={filters.bedrooms >= 0 ? filters.bedrooms : 0} // Ensure value is not negative
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          min="0" // Ensure input cannot go below zero
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Number of Beds</h3>
        <input
          type="number"
          name="beds"
          value={filters.beds >= 0 ? filters.beds : 0}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          min="0"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Number of Bathrooms</h3>
        <input
          type="number"
          name="bathrooms"
          value={filters.bathrooms >= 0 ? filters.bathrooms : 0}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          min="0"
        />
      </div>
      <button
        onClick={onApplyFilters}
        className="bg-black text-white p-2 rounded-lg w-full mt-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Done
      </button>

    </div>
  );
};

export default PopupFilters;