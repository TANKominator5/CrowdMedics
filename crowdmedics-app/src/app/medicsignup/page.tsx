'use client';
import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicSignupPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push('/profilecompletion');
        router.refresh();
      }
    };
    checkSession();
  }, [router]);

  const getURL = () => {
    let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url + 'profilecompletion';
  };

  return (
    <div className="fullscreen-center bg-gradient-to-br from-[#43cea2] via-[#185a9d] to-[#a18cd1] animate-fadeIn">
      <div className="mb-12 text-6xl font-extrabold gradient-text drop-shadow-2xl animate-fadeIn">CrowdMedics <span className="text-6xl">🚑</span></div>
      <div className="glass glow-border p-12 rounded-3xl shadow-2xl max-w-xl w-full flex flex-col items-center border border-white/20">
        <h1 className="text-3xl font-bold mb-8 gradient-text drop-shadow-xl">Medic Login or Sign Up</h1>
        <div className="w-full text-white/95 drop-shadow-xl">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#43cea2', brandAccent: '#a18cd1', defaultButtonBackground: '#1f2937', defaultButtonBackgroundHover: '#374151', inputBackground: '#111827', inputBorder: '#4b5563', inputText: 'white', messageText: '#fff' } } } }}
            providers={['google']}
            redirectTo={getURL()}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
} 