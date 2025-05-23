'use client'
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";

import { getAnalyticsDetails } from '@/actions/analytics/analytics..action'
import DynamicHead from "@/components/DynamicHead";


const scatterData = [
  { x: 1, y: 2 }, { x: 2, y: 5 }, { x: 3, y: 1 }, { x: 4, y: 4 },
  { x: 5, y: 7 }, { x: 6, y: 3 }, { x: 7, y: 8 }, { x: 8, y: 6 },
];

const COLORS = [
  '#A67C52', // Warm Taupe - Elegant and balanced
  '#8FBC8F', // Sage Green - Soft and soothing
  '#4682B4', // Steel Blue - Calm and sophisticated
  '#56A3A6', // Dusty Teal - Fresh and subtle
  '#C78550', // Soft Copper - Warm and inviting
  '#A0522D', // Sienna - Rich and tasteful
  '#7F8C8D', // Slate Gray - Modern and minimalist
  '#B07AA1'  // Mauve - Gentle and refined
];



type BookingStat = {
  id: string;
  month: string;
  bookings: number;
  sales: number | null;
};

type salesPerListing = {
  id: string;
  title: string;
  bookings: number;
  sales: number | null;
};

const Dashboard: React.FC = () => {

  useEffect(() => {
    async function fetchanalyticsData() {
      const analyticsStats = await getAnalyticsDetails('abc', 'tanmay');
      // console.log({ analyticsStats })
      setSuccessfulBookings(analyticsStats.successfulBookings)
      setTotalListings(analyticsStats.totalListings)
      setTotalSales(analyticsStats.sales ?? 0)
      setbookingOverTime(analyticsStats.bookingStats)
      setsalesPerListing(analyticsStats.salesPerListins)
    }
    fetchanalyticsData()
  }, [])


  const [successfulBookings, setSuccessfulBookings] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [bookingOverTime, setbookingOverTime] = useState<BookingStat[]>([]);
  const [salesPerListing, setsalesPerListing] = useState<salesPerListing[]>([]);



  return (
    <div className="min-h-screen bg-gray-100">
      <DynamicHead title={"HostPanel - Analytics"} />

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
                <div className="rounded-full mr-4 relative h-14 w-14">
                  <Image  src={"/host/booking.svg"} alt="rupee" width={80} height={80}/>
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Successful Bookings
                  </h3>
                  <p className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                    {successfulBookings}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
                <div className="relative rounded-full mr-4 h-14 w-14">
                <Image  src={"/host/listing.svg"} alt="rupee" width={80} height={80}/>
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Total Listings
                  </h3>
                  <p className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                    {totalListings}
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5 flex items-center">
                <div className="relative rounded-full mr-4 w-14 h-14">
                <Image  src={"/host/rupee.svg"} alt="rupee" width={80} height={80}/>
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Total Sales
                  </h3>
                  <p className="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                    {totalSales.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Bookings Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingOverTime}>
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(tick) => Number.isInteger(tick) ? tick : ''}
                      interval={0}
                      domain={[0, 'dataMax']}
                      allowDecimals={false}
                    />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Listings Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesPerListing}
                      dataKey="sales"
                      nameKey="title"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {salesPerListing.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Monthly Sales
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#0cb7b7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  User Engagement
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="Days" unit="d" />
                    <YAxis type="number" dataKey="y" name="Engagement" unit="%" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Engagement" data={scatterData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>


          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
