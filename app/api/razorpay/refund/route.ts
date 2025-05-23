import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { payment_id, amount } = await req.json();

    if (!payment_id) {
      return NextResponse.json({ success: false, error: "Payment ID is required" }, { status: 400 });
    }

    const refund = await razorpay.payments.refund(payment_id, { amount });

    return NextResponse.json({ success: true, refund }, { status: 200 });
  } catch (error: any) {
    console.error("Refund Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
