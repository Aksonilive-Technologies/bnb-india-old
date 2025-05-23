import { useState } from "react";
import Image from "next/image";
import { MdOutlineImageNotSupported } from "react-icons/md";
const ImageWithFallBack = (
    { url, className }: {
        url: string | undefined
        className?: string
    }
) => {
    const [imageError, setImageError] = useState(false);
    // console.log(url);

    return (
        <div className="relative shadow-md w-full h-full">
            {url && !imageError ? (
                <Image
                    alt="villa image"
                    src={url}
                    fill={true}
                    className={className}
                    style={{ objectFit: 'cover' }}
                    onError={() => setImageError(true)} // Handle image loading error
                />
            ) : (
                <div className="flex w-full h-full justify-center bg-gray-100 items-center text-gray-500">
                    <MdOutlineImageNotSupported size={50} />
                </div>
            )}
        </div>
    );
};

export default ImageWithFallBack