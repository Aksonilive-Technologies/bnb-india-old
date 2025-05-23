// pages/bookings.js
'use client'
import { useSocketStore } from '@/store/socketStore';
import Link from 'next/link';


export default function RecentActivity() {
    const { NotificationData } = useSocketStore();
    if (!NotificationData) {
        return <div>Loading...</div>;
    }else{
        console.log(NotificationData)
    }
    return (
        <div>

            {NotificationData?.length === 0 ? (
                <p>No new Recent Activities found</p>
            ) : (
                <div className=' display-no-scroll'>
                    <ul className='m-[10px] display-no-scroll'>
                        {NotificationData.map((activity: any, index: any) => {
                            const updatedAt = new Date(activity.updatedAt);
                            const formattedDate = updatedAt.toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                                day: "numeric",
                                month: "long",
                            });

                            // Determine the message based on the activity type
                            // Determine the message based on the activity type and status
                            let message = "";
                            let message2 = "";
                            if (activity.type === "booking") {
                                switch (activity?.status) {
                                    case "Confirmed":
                                        message = `🎉 New booking confirmed for property : ${activity?.villaName}`;
                                        break;
                                    // case "Pending":
                                    //     message = `⌛ Booking for property  ${activity?.villaName} is pending.`;
                                    //     break;
                                    case "Cancelled":
                                        message = `❌ Booking for property  ${activity?.villaName} has been cancelled. Please process the refund.`;
                                        break;
                                    // default:
                                    //     message = `🔔 Booking update for property  ${activity?.villaName}`;
                                    //     break;
                                }
                            }
                            else {
                                message = `🎉 New review for property : ${activity?.villaName}`;
                                message2 = `${activity.
                                    review_1
                                    }`;
                            }
                            // if (message === "") {
                            //     continue;
                            // }

                            return (
                                <li
                                    key={index}
                                    className="p-4 my-1 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
                                >
                                    <Link
                                        href={`/hostpanel/mybookings/${activity.id}/viewAndManage`}
                                    >
                                        <p className="text-sm font-medium text-gray-900">{message}</p>
                                        <p className="text-sm font-medium italic text-gray-900">{message2}</p>
                                        <p className="text-sm text-gray-500">{formattedDate}</p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

            )}
        </div>
    );
}



{/* <ul className="divide-y divide-gray-100 ">
    {activitiesData.slice(0, 20).map((d, index) => (
        <li
            key={index}
            className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
            <p className="text-sm font-medium text-gray-900">{d.message}</p>
            <p className="text-sm text-gray-500">
                {formatTimestamp(d.time)}
            </p>
        </li>
    ))}
</ul>  */}