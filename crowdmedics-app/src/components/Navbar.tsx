// src/components/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Check for an existing session on component mount
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();

    // 2. Listen for authentication state changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    // 3. Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to login page after logout
    router.push('/login');
    router.refresh(); // Forces a refresh to clear any cached user data
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
          CrowdMedics 🚑
        </Link>

        {/* Navigation Links and Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/leaderboard" className="hover:text-gray-300">
            Leaderboard
          </Link>
          
          {user ? (
            // If user is logged in, show Dashboard and Logout
            <>
              <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-medium">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in, show Login button
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}