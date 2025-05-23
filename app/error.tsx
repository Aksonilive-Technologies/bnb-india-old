"use client";

import Image from "next/image";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Image
        src="/error.jpg"
        alt="Not-found Image"
        width={1300}
        height={800}
        className="h-80 w-full object-cover"
      />

      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-xl px-4 py-8 text-center">
          <h1 className="text-pretty text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Uh-oh! Something went wrong.
          </h1>

          <h2 className="mt-4 text-gray-500">{error.message}</h2>

          <div className="flex justify-center gap-10">
            <button
              onClick={() => reset()}
              className="mt-6 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring"
            >
              Try Again
            </button>
            <Link
              href={"/"}
              className="mt-6 inline-block rounded bg-white px-5 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-600 focus:outline-none focus:ring"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
