'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      // Fetch medic profile from helpers table
      const { data, error } = await supabase
        .from('helpers')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl">Profile not found.</span>
      </div>
    );
  }

  // Determine badge and status
  const isVerified = profile.verified === true;
  const badge = isVerified
    ? <span className="ml-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">Verified</span>
    : <span className="ml-2 px-3 py-1 bg-yellow-400 text-white rounded-full text-sm font-semibold">Unverified</span>;
  const status = isVerified
    ? null
    : <div className="mt-2 text-yellow-700 font-medium">Status: Pending Approval</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {profile.name} {badge}</h1>
        {status}
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}
