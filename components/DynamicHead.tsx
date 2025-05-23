"use client";

import { useEffect } from "react";
import Head from "next/head";

interface DynamicHeadProps {
  title: string;
}

export default function DynamicHead({ title }: DynamicHeadProps) {
  useEffect(() => {
    document.title = `${title}`;
  }, [title]);

  return (
    <Head>
      <title>{title ||'bnbIndia' }</title>
    </Head>
  );
}
