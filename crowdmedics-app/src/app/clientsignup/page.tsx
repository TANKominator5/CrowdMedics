'use client';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientSignupPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/sos');
        router.refresh();
      }
    };
    checkSession();
  }, [router]);

  const getURL = () => {
    let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url + 'sos';
  };

  return (
    <div className="fullscreen-center bg-gradient-to-br from-[#a18cd1] via-[#fbc2eb] to-[#f6d365]">
      <div className="mb-12 text-6xl md:text-7xl font-extrabold gradient-text drop-shadow-2xl flex items-center gap-4 select-none animate-fadeIn">
        <span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">Crowd</span>
          <span className="bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 bg-clip-text text-transparent ml-2">Medics</span>
        </span>
        <span className="text-6xl md:text-7xl animate-bounce">🚑</span>
      </div>
      <div className="glass glow-border p-12 rounded-3xl shadow-2xl max-w-xl w-full flex flex-col items-center border border-white/20">
        <h1 className="text-3xl font-bold mb-8 gradient-text drop-shadow-xl">Client Login or Sign Up</h1>
        <div className="w-full text-white/95 drop-shadow-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#a18cd1', brandAccent: '#fbc2eb', defaultButtonBackground: '#1f2937', defaultButtonBackgroundHover: '#374151', inputBackground: '#111827', inputBorder: '#4b5563', inputText: 'white', messageText: '#fff' } } } }}
            providers={['google']}
            redirectTo={getURL()}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
} 