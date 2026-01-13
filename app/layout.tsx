import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL("https://gapsense-beryl.vercel.app"),
  title: {
    default: "GapSense | AI-Powered Research Gap Analysis",
    template: "%s | GapSense"
  },
  description: "Identify hidden research opportunities. GapSense analyzes thousands of arXiv papers using AI to find unexplored gaps in your field.",
  keywords: ["Research Gap Analysis", "AI Research Assistant", "arXiv Paper Search", "Academic Insights", "Literature Review"],
  openGraph: {
    title: "GapSense | Accelerate Your Research",
    description: "Stop searching, start discovering. Use AI to map out research trends and find your next thesis topic.",
    images: [{
        url: "https://github.com/user-attachments/assets/4501a95e-5264-434b-b69a-97ef98f5d9d7",
        width: 1200,
        height: 630,
        alt: "GapSense Research Analysis Preview",
      }], 
      locale: "en_US",
      type: "website",
  },
  // 🔥 ADD THIS SECTION FOR WHATSAPP/TWITTER
  twitter: {
    card: "summary_large_image",
    title: "GapSense | AI-Powered Research Gap Analysis",
    description: "Identify hidden research opportunities using AI.",
    images: ["https://github.com/user-attachments/assets/4501a95e-5264-434b-b69a-97ef98f5d9d7"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
