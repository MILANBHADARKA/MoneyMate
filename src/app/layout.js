import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/header/Header";
import LayoutWrapper from "@/components/layoutwrapper/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoneyMate - Personal Finance Made Simple",
  description:
    "Track your money, expenses, and finances with complete transparency and ease. MoneyMate helps you stay organized and take control of your financial journey.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <UserProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
