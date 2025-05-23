import React from 'react';

interface StarsSectionProps {
  cleanliness: number | null;
  onCleanlinessClick: (value: number) => void;
  communication: number | null;
  onCommunicationClick: (value: number) => void;
  houserules: number | null;
  onHouserulesClick: (value: number) => void;
  onNext: () => void;
}

const StarsSection: React.FC<StarsSectionProps> = ({
  cleanliness,
  onCleanlinessClick,
  communication,
  onCommunicationClick,
  houserules,
  onHouserulesClick,
  onNext
}) => {
  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Cleanliness</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onCleanlinessClick(star)}
              className={`text-3xl ${cleanliness && cleanliness >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Communication</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onCommunicationClick(star)}
              className={`text-3xl ${communication && communication >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold mb-2">House Rules</h2>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onHouserulesClick(star)}
              className={`text-3xl ${houserules && houserules >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      
        <button
          className="red-gradient text-white p-2 px-8 rounded-md"
          onClick={onNext}
        >
          NEXT
        </button>
    </div>
  );
};

export default StarsSection;