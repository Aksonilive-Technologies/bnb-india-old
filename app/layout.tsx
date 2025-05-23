import { Nunito } from "next/font/google";

import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

const global_font = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${global_font.className}`}>
        <Toaster />
        <>
          <div>{children}</div>
        </>
      </body>
    </html>
  );
}

// TODO: Add the other actions folder with user actions.
// TODO: Create auth route group folders.
