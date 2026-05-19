import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "House Manual — Create a Handoff Document for New Homeowners",
  description:
    "Free tool for home sellers. Document utilities, shutoffs, appliances, contacts, and local knowledge. Generate a professional PDF in minutes. No signup, 100% private.",
  openGraph: {
    title: "House Manual — Create a Handoff Document for New Homeowners",
    description:
      "Free tool for home sellers. Document everything about your house and generate a professional PDF for the new owners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
