import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayoutShell from "./ClientLayoutShell";
import { ThemeProvider } from "./ThemeContext";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "HR Platforma",
  description: "Moderna HR platforma za upravljanje ljudskim resursima",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] font-sans`}>
        <ThemeProvider>
          <ClientLayoutShell>{children}</ClientLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
