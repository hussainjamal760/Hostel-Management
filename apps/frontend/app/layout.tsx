import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
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
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body
        className={`${manrope.variable} font-sans antialiased`}
      >
        <StoreProvider>
          <AuthInitializer>
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
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}
