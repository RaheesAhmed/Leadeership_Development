import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"; // Update this import path
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Leadership Consulting",
  description: "Revolutionizing Leadership Development for the 21st Century",
};

interface BrandingConfig {
  logo: string;
  colors: {
    primary: string;
    secondary: string;
  };
  companyName: string;
}

const getBrandingConfig = async (domain: string): Promise<BrandingConfig> => {
  // Implement your branding configuration logic here
  return {
    logo: "/default-logo.png",
    colors: {
      primary: "#1a365d",
      secondary: "#2b6cb0",
    },
    companyName: "Default Company",
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background`}
      >
        <AuthProvider>
          <SubscriptionProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
