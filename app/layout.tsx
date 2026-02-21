import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "RemoteJobsPH — 🇵🇭 Remote Jobs for Filipinos",
  description: "Browse 1000+ remote companies hiring Filipino talent. Filter by Pinoy VA, Agency, Gig and more.",
  openGraph: {
    title: "RemoteJobsPH — 🇵🇭 Remote Jobs for Filipinos",
    description: "Browse 1000+ remote companies hiring Filipino talent. Filter by Pinoy VA, Agency, Gig and more.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const svgFavicon = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23120f1d'/><text x='16' y='21' font-family='sans-serif' font-weight='700' font-size='16' text-anchor='middle' fill='%2300e676'>RJ</text></svg>`;

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={svgFavicon} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
