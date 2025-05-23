import React from 'react';

interface ReviewQuestionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  stayAgain: boolean;
  onStayAgainChange: (value: boolean) => void;
  onSubmit: () => void;
  onPrevious: () => void;
}

const ReviewQuestionSection: React.FC<ReviewQuestionSectionProps> = ({
  description,
  onDescriptionChange,
  stayAgain,
  onStayAgainChange,
  onSubmit,
  onPrevious
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Review this property</h2>
      <textarea
        className="w-full p-2 border rounded-md mb-4"
        rows={5}
        placeholder="Description..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      {description.length? ('') : (<p className='text-red-600'>Please enter your review</p>)}
      <br />
        <div className="flex flex-col mb-4">
            <label className="mr-2">Would you stay again?</label>
            <div>
                <button 
                    className={`px-10 py-2 mr-2 rounded border border-black text-black ${stayAgain ? 'bg-black text-white' : ''}`} 
                    onClick={() => onStayAgainChange(true)}>Yes</button>
                <button 
                    className={`px-10 py-2 rounded border border-black text-black ${!stayAgain ? 'bg-black text-white' : ''}`} 
                    onClick={() => onStayAgainChange(false)}>No</button>
            </div>
        </div>
        <br />
        <div className="flex justify-between">
            <button
                className="red-gradient text-white p-2 rounded-md"
                onClick={onPrevious}
                >
                PREVIOUS
                </button>
                <button
                className="red-gradient text-white p-2 rounded-md"
                onClick={onSubmit}
            >
                SUBMIT
            </button>
      </div>
      
    </div>
  );
};

export default ReviewQuestionSection;