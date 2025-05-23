"use client"

import React from 'react'
import Calendar from './BigCalender';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();
  const id  = Array.isArray(params!.id) ? params!.id[0] : params!.id;; 

  return (
    <div>
      <Calendar Villa_id={id} />

    </div>
  )
}

export default Page