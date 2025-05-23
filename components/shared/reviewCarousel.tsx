import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ReviewCard from "./reviewCard";
import { getInfluencersReview } from "@/actions/review/review.action";


export async function ReviewCarousel() {

  const data: any = await getInfluencersReview()

  return (
    <Carousel className="w-[96%]   ">
      <CarouselContent>
        {data.map((d: any, index: any) => (
          <CarouselItem key={index} className="lg:basis-1/3 my-1  max-w-[100%] ">
            <div className=" relative h-full">
              <ReviewCard data={d} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
