import type { Metadata } from "next";
import "./styles.css";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Videomaker Studio",
  description: "DOP / Filmmaker / Video editor based in Barcelona",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="grid grid-cols-12 gap-px">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
