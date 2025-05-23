'use client';
import React from "react";
import { Slider } from "@nextui-org/slider";

interface RangeSliderProps {
  value: [number, number];
  setValue: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ value, setValue }) => {
  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setValue(newValue as [number, number]);
    }
  };
  console.log(value);
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return parseInt((num / 1000).toFixed(1)) + 'k';
    }
    return num.toString();
  };

  return (
    <Slider
      label="Price Range"
      step={5000}
      value={value}
      onChange={handleChange}
      maxValue={100000}
      minValue={0}
      showSteps={true}
      showTooltip={true}
      showOutline={true}
      getValue={() => {
        const minValue = formatNumber(value[0]);
        const maxValue = formatNumber(value[1]);

        let valuetodisplay = `₹${minValue} - ₹${maxValue}`;
        if (value[1] === 100000) {
          valuetodisplay += '+';
        }

        return valuetodisplay;
      }}
      formatOptions={{ style: "currency", currency: "INR" }}
      tooltipValueFormatOptions={{ style: "currency", currency: "INR", maximumFractionDigits: 0 }}
      classNames={{
        base: "max-w-md",
        track: "bg-gray-300 h-1 rounded-full",
        filler: "bg-pink-300",
        labelWrapper: "mb-2",
        label: "font-medium text-default-700 text-medium",
        value: "font-medium text-default-500 text-small",
        thumb: "bg-pink-300 h-6 w-6 rounded-full shadow-lg cursor-pointer",
      }}
      renderThumb={(props) => (
        <div
          {...props}
          className="mt-[1px] drop-shadow-lg w-4 h-4 bg-gray-300 rounded-full cursor-grabbing"
        ></div>
      )}
      tooltipProps={{
        offset: 5,
        placement: "top",
        classNames: {
          content: "text-md text-white bg-pink-300 rounded-md p-2",
        },
      }}
    />
  );
}

export default RangeSlider;
