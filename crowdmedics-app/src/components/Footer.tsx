// src/components/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full glass glow-border mt-0 py-10 px-0 flex flex-col items-center justify-center border-t-0 shadow-2xl bg-white/10">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8 gap-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-3xl md:text-4xl font-extrabold gradient-text drop-shadow-xl mb-2 flex items-center gap-2">
            <Image
              src="/1000082630-removebg-preview.png"
              alt="CrowdMedics Logo"
              width={40}
              height={40}
              className="drop-shadow-xl"
            />
            CrowdMedics
          </div>
          <p className="text-lg text-white/80 mb-2 md:mb-0">A platform to connect heroes with those in need.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link href="/about" className="text-lg text-white/90 hover:gradient-text font-semibold transition-all">About</Link>
          <Link href="/contact" className="text-lg text-white/90 hover:gradient-text font-semibold transition-all">Contact</Link>
          <Link href="/privacy" className="text-lg text-white/90 hover:gradient-text font-semibold transition-all">Privacy Policy</Link>
        </div>
      </div>
      <div className="w-full text-center mt-8 text-white/60 text-base">
        © {currentYear} CrowdMedics. All Rights Reserved.
      </div>
    </footer>
  );
}