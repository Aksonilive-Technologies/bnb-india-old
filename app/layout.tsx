import { Nunito } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/shared/footer";

import "@/styles/globals.css";

const global_font = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${global_font.className} flex flex-col min-h-screen`}>
        <Toaster />
        <>
          <div className="flex-grow">{children}</div>
          <Footer />
        </>
      </body>
    </html>
  );
}

// TODO: Add the other actions folder with user actions.
// TODO: Create auth route group folders.
