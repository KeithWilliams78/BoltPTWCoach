import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Strategy Coach - Master Strategic Thinking with Playing to Win',
  description: 'Build winning strategies using the proven Playing to Win framework with AI-powered coaching. Create your 5-choice strategy cascade with intelligent guidance and feedback.',
  keywords: 'strategy, strategic planning, playing to win, business strategy, AI coach, strategy framework',
  authors: [{ name: 'AI Strategy Coach' }],
  openGraph: {
    title: 'AI Strategy Coach - Master Strategic Thinking',
    description: 'Build winning strategies using the proven Playing to Win framework with AI-powered coaching.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}