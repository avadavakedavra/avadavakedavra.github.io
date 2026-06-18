import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Vatanappally Schools Directory | Best Schools in Thrissur",
  description: "Comprehensive directory of schools in Vatanappally and the surrounding 15km region in Thrissur, Kerala. Find CBSE, Kerala State schools with Plus Two Science, Commerce and Humanities streams.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
