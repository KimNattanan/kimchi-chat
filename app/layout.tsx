import { GeistMono } from "geist/font/mono";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Online Chat | Kimchi",
  description: "Next.js with Supabase",
  openGraph:{
    images: "https://kimchi-nyabe-chat.vercel.app/corgi2.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.className} suppressHydrationWarning>
      <body className="bg-amber-100 text-foreground selection:bg-rose-300">
        {children}
      </body>
    </html>
  );
}
