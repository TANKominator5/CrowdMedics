// src/app/login/page.tsx
'use client';

import { supabase } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // If the event is SIGNED_IN, the user has successfully logged in or signed up.
      // We redirect them to the home page to be handled by the main layout logic.
      if (event === 'SIGNED_IN') {
        router.push('/');
        // Use router.refresh() to ensure the server-side state is updated.
        // This helps the main page correctly identify the new user.
        router.refresh(); 
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, [router]);

  // This gets the base URL of your deployed site for the redirect
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
      'http://localhost:3000/';
    // Make sure to include `https` in production
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Logo Placeholder */}
      <div className="mb-8 text-5xl font-bold">
        LOGO 🚑
      </div>
      
      <h1 className="text-2xl font-semibold mb-4">Login or Sign Up</h1>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700">
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3b82f6', // Blue-500
                  brandAccent: '#2563eb', // Blue-600
                  defaultButtonBackground: '#1f2937', // Gray-800
                  defaultButtonBackgroundHover: '#374151', // Gray-700
                  inputBackground: '#111827', // Gray-900
                  inputBorder: '#4b5563', // Gray-600
                  inputText: 'white',
                  messageText: '#9ca3af', // Gray-400
                },
              },
            },
          }}
          providers={['google']} // This enables the Google button
          redirectTo={getURL()} // Redirect after Google login
          theme="dark"
        />
      </div>
    </div>
  );
}