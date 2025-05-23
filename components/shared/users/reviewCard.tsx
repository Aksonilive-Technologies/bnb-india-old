import Image from 'next/image';

export default function ReviewCard({ data }: any) {
    const { image, reviewerName, description, stayedAt } = data;

    return (
        <div className="card flex flex-col border-2 justify-between h-full bg-white p-4 rounded-xl max-w-lg">
            {/* Stay At */}


            {/* Description */}
            <div className="pl-4 flex flex-col mb-4">
                <h5 className="text-sm text-gray-400 font-semibold">
                    Stay at {stayedAt}
                </h5>
                <p className="text-base font-normal text-black mt-4 overflow-hidden">
                    {description}
                </p>
            </div>

            {/* Reviewer Details */}
            <div className="flex flex-row items-center justify-between">
                {/* Image and Reviewer Info */}
                <div className="flex flex-row items-center w-2/3">
                    <div className="w-12 h-12 border-4 border-pink-500 rounded-full overflow-hidden mr-4">
                        <Image
                            src={image}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-md font-bold">{reviewerName}</h3>
                    </div>
                </div>

                {/* Date */}
                <p className="text-sm font-semibold text-gray-500 mt-2">
                    12 Dec 2023
                </p>
            </div>
        </div>


    );
}