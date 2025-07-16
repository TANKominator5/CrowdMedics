// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

interface NavbarProps {
  variant?: 'floating' | 'standard';
}

export default function Navbar({ variant = 'standard' }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crowdmedics_role');
    }
    router.push('/');
  };

  const navClasses = variant === 'floating' 
    ? "fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[98vw] max-w-5xl glass glow-border flex items-center justify-between px-10 py-5 shadow-2xl"
    : "w-full bg-white/10 backdrop-blur-sm border-b border-white/20 flex items-center justify-between px-6 py-4 shadow-lg";

  return (
    <nav className={navClasses}>
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="CrowdMedics Logo"
          width={variant === 'floating' ? 50 : 40}
          height={variant === 'floating' ? 50 : 40}
          className="drop-shadow-lg"
        />
        <Link href="/" className="text-2xl font-bold gradient-text drop-shadow-lg">
          CrowdMedics
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/dashboard" className="text-white/90 hover:text-white font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/sos" className="text-white/90 hover:text-white font-medium transition-colors">
              SOS
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-white/90 hover:text-white font-medium transition-colors">
              Login
            </Link>
            <Link href="/clientsignup" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Get Protected
            </Link>
            <Link href="/medicsignup" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Be a Medic
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
