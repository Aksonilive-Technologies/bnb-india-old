// import type { NextApiRequest, NextApiResponse } from 'next';
// import Razorpay from 'razorpay';

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { amount, currency, receipt } = req.body;

//     try {
//       const order = await razorpay.orders.create({
//         amount,
//         currency,
//         receipt,
//       });

//       res.status(200).json(order);
//     } catch (error) {
//       res.status(500).json({ error: 'Error creating order' });
//     }
//   } else {
//     res.status(405).end();
//   }
// }

export default function razorpay(){
  return('abcd')
}