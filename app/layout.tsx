import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/landing/Header";
import DevAttributeGuard from "@/components/dev/DevAttributeGuard";
import { LanguageProvider } from "@/lib/LanguageContext";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brahmi Lipi | Ancient Wisdom, Modern Learning",
  description: "Learn the ancient Brahmi Lipi script through structured lessons inspired by Jain philosophy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          <Header />
          <DevAttributeGuard />
          <main className="min-h-screen">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
