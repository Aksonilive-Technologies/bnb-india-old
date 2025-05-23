import StarRating from "./starRating"
import Image from "next/image"

interface villaRatingCardProps{
    image : string,
    name : string,
    rating : number,
    time : string,
    reviewComment : string
}

export default function VillaReviewCard({image,name , rating, time , reviewComment} : villaRatingCardProps){
    return(
        <div className="w-full md:w-[80%] border-2 flex flex-col gap-3 p-4 rounded-lg my-3">
            <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-lg relative overflow-hidden">
                    <Image 
                    src={image}
                    alt="profile image" 
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                />
                </div>
                <div>
                <p>{name}</p>
                <StarRating rating={rating} size={3}/>
                <p className="text-xs text-gray-500">{time}</p>
                </div>
            </div>

            <p className="text-sm">
                {reviewComment}
            </p>

    </div>
    )
}