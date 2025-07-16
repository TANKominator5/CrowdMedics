"use client";
import Link from 'next/link';
import { ShieldCheck, Siren, UserRoundCheck, HeartPulse } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const navbar = document.querySelector('nav.bg-gray-800');
    if (navbar && navbar instanceof HTMLElement) navbar.style.display = 'none';
    return () => {
      if (navbar && navbar instanceof HTMLElement) navbar.style.display = '';
    };
  }, []);
  return (
    <div className="fullscreen-center relative min-h-screen w-full overflow-x-hidden animate-fadeIn">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#a18cd1] via-[#fbc2eb] to-[#f6d365]">
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Floating Navbar */}
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[98vw] max-w-5xl glass glow-border flex items-center justify-between px-10 py-2 shadow-2xl">
        <a
          href="/clientsignup"
          className="btn-animated bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl glow-border"
        >
          Get Protected
        </a>
        <div className="flex-1 flex justify-center">
          <a href="/" className="flex items-center justify-center select-none animate-fadeIn">
            <Image
              src="/1000082630-removebg-preview.png"
              alt="CrowdMedics Logo"
              width={160}
              height={160}
              className="drop-shadow-2xl -my-6"
            />
          </a>
        </div>
        <a
          href="/medicsignup"
          className="btn-animated bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl glow-border"
        >
          Be a Medic
        </a>
      </nav>
      <main className="w-full flex flex-col items-center justify-center flex-1 pt-40 pb-20 z-10 relative">
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto mb-12 animate-fadeIn">
          <div className="glass glow-border p-10 md:p-16 rounded-3xl shadow-2xl flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight gradient-text drop-shadow-2xl mb-8 text-center">
              Get Help Fast, Be a Hero.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-2xl text-white/95 drop-shadow-xl text-center">
              CrowdMedics instantly connects first-aid volunteers with nearby emergencies, bridging the critical gap before an ambulance arrives.
            </p>
          </div>
        </section>
        {/* Problem & Solution Section */}
        <section className="w-full max-w-5xl mx-auto mb-12 animate-fadeIn">
          <div className="glass glow-border p-10 md:p-16 rounded-3xl shadow-2xl flex flex-col items-center">
            <h2 className="text-4xl font-bold gradient-text drop-shadow-xl mb-6 text-center">The Problem: Every Second Counts</h2>
            <p className="mb-10 text-white/95 text-2xl drop-shadow-xl text-center">In a cardiac arrest, survival chances drop 10% every minute. Ambulance wait times can be fatal.</p>
            <h2 className="text-4xl font-bold gradient-text drop-shadow-xl mb-10 text-center">Our Solution: Instant Activation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
              <div className="glass glow-border p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fadeIn">
                <Siren className="h-16 w-16 text-red-400 mb-6 animate-pulse" />
                <h3 className="text-2xl font-semibold gradient-text drop-shadow-xl">SOS Triggered</h3>
                <p className="mt-3 text-white/95 text-lg drop-shadow-xl text-center">A person in need sends an alert with their live location and emergency type.</p>
              </div>
              <div className="glass glow-border p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fadeIn">
                <UserRoundCheck className="h-16 w-16 text-blue-400 mb-6 animate-bounce" />
                <h3 className="text-2xl font-semibold gradient-text drop-shadow-xl">Medic Notified</h3>
                <p className="mt-3 text-white/95 text-lg drop-shadow-xl text-center">Our system finds and instantly alerts the nearest available CrowdMedic.</p>
              </div>
              <div className="glass glow-border p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fadeIn">
                <HeartPulse className="h-16 w-16 text-green-400 mb-6 animate-pulse" />
                <h3 className="text-2xl font-semibold gradient-text drop-shadow-xl">Help Arrives</h3>
                <p className="mt-3 text-white/95 text-lg drop-shadow-xl text-center">The volunteer provides crucial aid, guided by our app, until professionals take over.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Who can be a CrowdMedic? Section */}
        <section className="glass glow-border rounded-3xl p-14 md:p-20 my-20 mx-auto max-w-5xl text-center shadow-2xl border border-white/10 animate-fadeIn">
          <ShieldCheck className="h-24 w-24 mx-auto text-yellow-400 mb-8 animate-fadeIn" />
          <h2 className="text-4xl font-bold gradient-text mb-4 drop-shadow-xl">Who Can Be a CrowdMedic?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-white/95 text-2xl drop-shadow-xl">
            If you have basic first-aid training, you have the power to save a life. You don't need to be a doctor to be a hero.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-5 text-lg">
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">CPR-Trained Citizens</span>
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">Nursing Students</span>
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">Red Cross Volunteers</span>
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">Ex-Military/Police</span>
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">Medical Interns</span>
            <span className="bg-white/10 text-white/95 px-8 py-4 rounded-full shadow btn-animated glow-border drop-shadow-xl">Scouts & Guides</span>
          </div>
          <div className="mt-12">
            <a
              href="/medicsignup"
              className="btn-animated bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold py-4 px-14 rounded-full text-2xl shadow-xl glow-border"
            >
              Join the Network Today
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}