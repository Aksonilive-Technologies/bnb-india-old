// import Razorpay from 'razorpay';
// import { NextRequest, NextResponse } from 'next/server';

// const razorpay = new Razorpay({
//  key_id: process.env.key_id!,
//  key_secret: process.env.key_secret,
// });

// export async function POST(request: NextRequest) {
//  const { amount, currency } = (await request.json()) as {
//   amount: string;
//   currency: string;
//  };

//  var options = {
//   amount: amount,
//   currency: currency,
//   receipt: 'rcp1',
//  };
//  const order = await razorpay.orders.create(options);
//  console.log(order);
//  return NextResponse.json({ orderId: order.id }, { status: 200 });
// }


import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR' } = await req.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required.', status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const options = {
      amount: amount, // Convert to smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(12).substring(4)}`,
    };

    const order = await razorpay.orders.create(options);
    console.log(order);

    return NextResponse.json({ orderId: order.id, status: 200 });

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order', details: error.message || error }, { status: 500 });
  }
}
