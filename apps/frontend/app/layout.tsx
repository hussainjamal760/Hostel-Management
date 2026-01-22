import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
