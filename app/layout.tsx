import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "../styles/globals.css";

let title = "Fashion Editing Tool";
let description = "Take a picture of a person, then modify clothing or explore fashion using fashionAI.";
let ogimage = "https://fashionai.me/og-image.png";
let sitename = "fashionAI.me";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: "https://fashionai.me",
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#00000f] text-gray-300">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
