import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getFormattedDateAndDay } from "@/utils/formatters/dateFormatter";
import Footer from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeVigil',
  description: 'Monitor your code for security vulnerabilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-slate-900 text-black dark:text-white`}>
        <div className="container mx-auto px-4 py-8">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
