import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/authContext";
import { BetaFeedbackModal } from "@/components/BetaFeedbackModal";
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
  title: "React Hospital — Learn React & Next.js by Debugging Real Apps",
  description: "Learn React and Next.js by fixing broken real-world apps with Dr. React, your AI debugging mentor.",
  keywords: ["React", "Next.js", "Debugging", "Learn React", "AI Mentor", "Frontend Developer", "Coding Hospital"],
  openGraph: {
    title: "React Hospital — Learn React & Next.js by Debugging Real Apps",
    description: "Learn React and Next.js by fixing broken real-world apps with Dr. React, your AI debugging mentor.",
    type: "website",
    siteName: "React Hospital",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Hospital — Learn React & Next.js by Debugging Real Apps",
    description: "Learn React and Next.js by fixing broken real-world apps with Dr. React, your AI debugging mentor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <BetaFeedbackModal />
        </AuthProvider>
      </body>
    </html>
  );
}
