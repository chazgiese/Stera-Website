import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stera.site'),
  title: "Stera ✻ Icons",
  description: "Open source icon library for Figma and React",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon-light-96x96.png',
        href: '/favicon-light-96x96.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark-96x96.png',
        href: '/favicon-dark-96x96.png',
      },
    ],
  },
  openGraph: {
    title: "Stera ✻ Icons",
    description: "Open source icon library for Figma and React",
    url: "https://stera.site", // Replace with your actual domain
    siteName: "Stera Icons",
    images: [
      {
        url: "/social-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stera Icons - Open source icon library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stera ✻ Icons",
    description: "Open source icon library for Figma and React",
    images: ["/social-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
