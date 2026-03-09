import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Hostelite - Hostel Management System",
  description: "Complete hostel management solution for owners, managers, and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-outfit antialiased`}
      >
        <StoreProvider>
          <Toaster 
            position="top-center"
            containerStyle={{
              zIndex: 999999,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2c1b13',
                color: '#fcf2e9',
                borderRadius: '12px',
                padding: '16px',
                zIndex: 999999,
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fcf2e9',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fcf2e9',
                },
              },
            }}
          />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
