import * as React from "react";
import VillaCard from "./villaCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { fetchTredingVillas } from '@/actions/listing/listing.action';

export async function TrendingCarousel() {

  interface TrendingVilla {
    id: string;
    name: string;
    image: string;
    price: string;
    city: string;
    state: string;
    rooms: string;
    family_only: boolean;
    bnbVerified: boolean;
  }

  const data = await fetchTredingVillas() as TrendingVilla[];
  // console.log("In UI");
  // console.log("In UI",{ data });

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {data.map((d, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/3 max-w-[100%] sm:max-w-[45%] md:max-w-[40%] xl:max-w-[25%] min-[1600px]:max-w-[20%]"
          >
            <div>
              <VillaCard
                image={d.image}
                name={d.name}
                totalPrice ={Number(d.price)}
                basePrice={Number(d.price)} 
                UpdatedPrice={Number(d.price)} 
                showTotal={false}
                city={d.city}
                state={d.state}
                rooms={Number(d.rooms)}
                id={d.id}
                family_only={d.family_only}
                bnbVerified={d.bnbVerified}
                reviewsData={[]}
                className="rounded-2xl"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
