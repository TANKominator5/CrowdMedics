'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import { useEffect } from 'react';

export default function SosPage() {
  const router = useRouter();

  useEffect(() => {
    const upsertClient = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/');
        return;
      }
      const user = session.user;
      await supabase.from('clients').upsert({ id: user.id, email: user.email });
    };
    upsertClient();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="fullscreen-center bg-gradient-to-br from-[#fbc2eb] via-[#f6d365] to-[#a18cd1] animate-fadeIn relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-center py-10 glass glow-border shadow-2xl">
        <div className="flex-1 flex justify-center">
          <span className="text-5xl font-extrabold gradient-text flex items-center gap-3 select-none drop-shadow-2xl animate-fadeIn">
            CrowdMedics <span className="text-5xl">🚑</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="absolute right-12 top-1/2 -translate-y-1/2 btn-animated bg-gradient-to-r from-red-500 to-pink-400 text-white font-bold py-3 px-10 rounded-full text-lg shadow-xl glow-border"
        >
          Logout
        </button>
      </div>
      {/* SOS Button Section */}
      <div className="flex flex-col items-center justify-center flex-1 mt-48">
        <button className="bg-white text-red-600 font-extrabold text-7xl rounded-full shadow-2xl px-28 py-20 border-8 border-red-500 hover:scale-110 transition-transform animate-pulse drop-shadow-2xl glow-border">
          SOS
        </button>
        <p className="mt-14 text-white/95 text-3xl max-w-2xl text-center drop-shadow-2xl glass p-8 rounded-2xl border border-white/10">
          Press the SOS button to instantly alert nearby CrowdMedics. Help is on the way!
        </p>
      </div>
    </div>
  );
} 