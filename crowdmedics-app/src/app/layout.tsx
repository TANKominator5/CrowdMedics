// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FooterConditional from '@/components/FooterConditional';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CrowdMedics: Uber for First Aid',
  description: 'Connecting first-aid volunteers to nearby emergencies instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow w-full min-h-screen p-0 m-0">
            <FooterConditional>{children}</FooterConditional>
          </main>
        </div>
      </body>
    </html>
  );
}