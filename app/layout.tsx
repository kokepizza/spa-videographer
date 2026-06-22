import type { Metadata } from "next";
import "./styles.css";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Preloader from "@/components/layout/preloader";
import Lines from "@/components/ui/lines";

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
      <body className="relative antialiased">
        <Preloader />
        <Lines />
        <Header />
        <main className="grid grid-cols-4 gap-0.5 px-2 pt-2 md:grid-cols-6 md:px-3 md:pt-3">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
