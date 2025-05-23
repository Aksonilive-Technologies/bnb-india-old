import Link from "next/link";
import Image from "next/image";
import truncateText from "@/utils/CommonFunctions";

interface BlogCardProps {
  id: string;
  key: string;
  image: string;
  name: string;
  discription: string;
  
}

export default function BlogCard({
    key,
    id,
    image,
    name,
    discription
     // Set default value for className prop
  }: BlogCardProps) {
  return (
    <div
      key={key}
      className="relative m-2 sm:m-4 cursor-pointer hover:drop-shadow-lg"
    >
      <Link href={`/blogs/${id}`}>
        <figure className="rounded-xl h-60 overflow-hidden mb-3">
          <Image
            src={image}
            alt={`featured blog thumbnail - ${id}`}
            width={1000}
            height={550}
            className="object-cover w-full h-full BlogMultiCardCarousel"
          />
        </figure>
        <h1 className="text-xl font-bold">{name}</h1>

        <div
          className="prose prose-sm prose-gray max-w-none mb-10 space-y-2"
          dangerouslySetInnerHTML={{ __html: truncateText(discription, 100) }}
        />
      </Link>
    </div>
  );
}
