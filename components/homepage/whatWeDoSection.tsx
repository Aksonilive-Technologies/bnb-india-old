// "use client";

// import { useEffect, useRef, useState } from "react";
import { Nunito } from "next/font/google";

// import CountUp from "react-countup";

const localfont = Nunito({ subsets: ["latin"] });

// const counterData = [
//   {
//     title: "guests",
//     count: 10000,
//   },
//   {
//     title: "properties",
//     count: 200,
//   },
//   {
//     title: "locations",
//     count: 20,
//   },
// ];

export default function WhatWeDoSection() {
//   const [startCount, setStartCount] = useState(false);
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           setStartCount(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 },
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

  return (
    <section className="bg-gray-50 py-6">
      <article
        className="w-full flex flex-col items-center text-center p-2 md:p-4 lg:px-8"
        id="whatwedo"
      >
        <header>
          <h2
            className={`${localfont.className} p-2 text-lg md:text-2xl lg:text-3xl text-sky-800 font-extrabold`}
            aria-label="WHAT IS BNBINDIA"
          >
            WHAT IS BNBINDIA
          </h2>
        </header>
        <p
          className="text-base md:text-lg py-2 lg:py-4 font-semibold text-gray-700"
          aria-label="what is bnbIndia"
        >
          BnBIndia is a premier short-term rental platform designed to connect
          travelers with unique and comfortable stays across India. Whether
          you're looking for a luxurious villa, a cozy homestay, or a
          budget-friendly apartment, we make finding the perfect accommodation
          seamless and hassle-free. Our platform empowers homeowners to monetize
          their spaces while giving travelers a chance to experience India like
          a local. We prioritize safety, transparency, and convenience by
          ensuring verified listings, secure payments, and 24/7 customer
          support. At BnBIndia, we believe that travel is more than just a
          destination—it's about the experiences you create along the way. Book
          your next stay with us and discover India in a whole new way!
        </p>

        {/* <div className="grid grid-cols-2 gap-4 p-2 lg:p-4 w-full sm:grid-cols-2 md:grid-cols-3">
          {counterData.map((d, index) => (
            <div
              className={`flex flex-col justify-center items-center p-4 ${index === 2 ? "col-span-2 sm:col-span-2 md:col-span-1" : ""}`}
              key={index}
              aria-label={`${d.count} plus ${d.title}`}
            >
              <p className="text-3xl md:text-4xl lg:text-6xl font-bold text-sky-800">
                {startCount && (
                  <CountUp startVal={d.count / 2} end={d.count} duration={2} />
                )}
                +
              </p>
              <p className="text-sm md:text-lg lg:text-2xl font-bold text-gray-800">
                {d.title}
              </p>
            </div>
          ))}
        </div> */}
      </article>
    </section>
  );
}
