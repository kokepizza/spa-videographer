import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ozzy Films",
  description: "DOP / Filmmaker / Video editor based in Barcelona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
