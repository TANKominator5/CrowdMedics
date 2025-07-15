'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import { ReactNode } from 'react';

export default function FooterConditional({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {children}
      {pathname === '/' && <Footer />}
    </>
  );
} 