import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ETL Dashboard | Data Engineering Telemetry",
  description: "High-performance SaaS dashboard for real-time ETL pipeline monitoring, data cleaning, and relational analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-blue-500/30`}>
        <DataProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 relative h-full">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-32 lg:pb-8">
              <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
