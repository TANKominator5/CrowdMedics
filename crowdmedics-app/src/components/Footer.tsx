// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="container mx-auto p-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
        <p>© {currentYear} CrowdMedics. All Rights Reserved.</p>
        <p className="text-sm mt-2">A platform to connect heroes with those in need.</p>
      </div>
    </footer>
  );
}